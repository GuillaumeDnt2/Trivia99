import { Player } from "./player";
import { QuestionManager } from "./questionManager";
import { Server } from "socket.io";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { EventEmitter } from 'events';
/**
 * Save the final player's stats and rank about the game
 */
class Rank {
  playerid:string;
  playerName:string;
  rank:number;
  goodAnswers:number;
  badAnswers:number;
  answeredQuestions:number;
  
  constructor(player:Player, rank:number){
    this.playerid = player.getId();
    this.playerName = player.getName();
    this.rank = rank;
    this.goodAnswers = player.getGoodAnswers();
    this.badAnswers = player.getBadAnswers();
    this.answeredQuestions = player.getAnsweredQuestion();
   
  }
}



/**
 * Game class
 * Handles the game's logic and state
 * @class
 */
@Injectable()
export class Game {
    private TIME_BETWEEN_QUESTION: number;
    private READY_PLAYERS_THRESHOLD: number;
    private NB_MIN_READY_PLAYERS: number;
    private SIZE_OF_QUESTION_QUEUE: number;
    private LEVEL1:number;
    private LEVEL2:number;
    private LEVEL3:number;
    private LEVEL4:number;
    private LEVEL1_t:number;
    private LEVEL2_t:number;
    private LEVEL3_t:number;
    private LEVEL4_t:number;
    public nbReady: number;
    private players: Map<string, Player>;
    private leaderboard: Rank[];
    private nbPlayerAlive: number;
    private hasStarted: boolean;
    private qManager: QuestionManager;
    private server: Server;
    private questionLoaded: boolean;
    private eventEmitter: any;
    private intervalId: NodeJS.Timeout;
    private nbQuestionsSent:number;
    private continueSending:boolean;
 

    /**
     * Game constructor
     * @constructor
     * @param server the server all the sockets are connected to
     * @param configService the configuration service to enable us to use the .env file
     */
    constructor(server: Server, private configService: ConfigService) {

        this.nbReady = 0;
        this.nbPlayerAlive = 0;
        this.players = new Map<string, Player>();
        this.hasStarted = false;
        this.server = server;
        this.configService = configService;
        this.questionLoaded = false;
        this.eventEmitter = new EventEmitter();
        this.continueSending = true;
        this.nbQuestionsSent = 0;

        // Load the configuration values from the .env file
        this.TIME_BETWEEN_QUESTION = parseInt(this.configService.get<string>("TIME_BETWEEN_QUESTION")) * 1000;
        this.READY_PLAYERS_THRESHOLD = parseInt(this.configService.get<string>("READY_PLAYERS_THRESHOLD"));
        this.NB_MIN_READY_PLAYERS = parseInt(this.configService.get<string>("NB_MIN_READY_PLAYERS"));
        this.SIZE_OF_QUESTION_QUEUE = parseInt(this.configService.get<string>("SIZE_OF_QUESTION_QUEUE"));
        this.LEVEL1 = parseInt(this.configService.get<string>("LEVEL1"));
        this.LEVEL2 = parseInt(this.configService.get<string>("LEVEL2"));
        this.LEVEL3 = parseInt(this.configService.get<string>("LEVEL3"));
        this.LEVEL4 = parseInt(this.configService.get<string>("LEVEL4"));
        this.LEVEL1_t = parseFloat(this.configService.get<string>("LEVEL1_T"));
        this.LEVEL2_t = parseFloat(this.configService.get<string>("LEVEL2_T"));
        this.LEVEL3_t = parseFloat(this.configService.get<string>("LEVEL3_T"));
        this.LEVEL4_t = parseFloat(this.configService.get<string>("LEVEL4_T"));
        this.eventEmitter = new EventEmitter();

        //this.qManager = new QuestionManager(configService);
        //this.qManager.initializeQuestions();
  
    }

    /**
     * Ask if game has started
     * @returns : true/false
     */
    public hasGameStarted() : boolean {
        return this.hasStarted;
    }

    /**
     * Stop sending question to players
     */
    public stopGame() : void{
        this.continueSending = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            
        }
    }

    /**
     * Get how many questions have not yet been used
     * @returns nb of question
     */
    public getNbQuestions() : number {
        return this.qManager.getUnusedQuestions();
    }

    /**
     * Check if the game can start and start it if it can
     * The game can start if the number of ready players is greater than the threshold
     */
    public checkAndStartGame() {
        if (!this.hasStarted) {
            if (
                this.getNbReady() >= this.NB_MIN_READY_PLAYERS &&
                //this.getNbReady() >= this.players.size * this.READY_PLAYERS_THRESHOLD
                this.getNbReady() == this.getNbPlayers()
            ) {
                this.startGame().then(() => console.log("Game started"));
            }
        }
    }

  /**
   * Add a new player to players list
   * @param id : id of the player
   * @param name : name chosen by the player
   * @param socket
   */
  public addPlayer(id: string, name: string, socket: any) : Player {
      let player = new Player(name, id,socket, this.configService);
    this.players.set(id, player);
    return player;
  }

  public removePlayer(player: Player) : void {
    this.players.delete(player.getId());
  }

    /**
     * Return the players map
     * @returns Map of players
     */
    public getPlayers() : Map<string, Player> {
        return this.players;
    }

    /**
     * Get how many players connected to the game (empêcher de faire gagner un joueur qui n'a pas joué (quitté après ready))
     * @returns
     */
    public getNbPlayers() : number {
        return this.players.size;
    }

    /**
     * Get how many players are still alive in the current running game
     */
    public getNbPlayerAlive() : number {
        return this.nbPlayerAlive;
    }

    /**
     * Get how many players are ready to start the game
     * @returns : how many ready players
     */
    public getNbReady() : number {
        return this.nbReady;
    }

    /**
     * Starting game procedure : create the question manager and fetch new questions
     */
    public async startGame() : Promise<void>{
        this.hasStarted = true;

        this.qManager = new QuestionManager(this.configService);
        await this.qManager.initializeQuestions();
        this.questionLoaded = true;
        this.eventEmitter.emit("loaded");

        this.nbPlayerAlive = this.players.size;
        this.server.emit("startGame", {
            msg: "The game has started",
        });

        //Send the player list
        //setTimeout(()=> this.server.emit("players", this.getAllPlayerList()),300);
        await this.sendTimedQuestionToEveryone();

        this.leaderboard = [];
    }

    /**
     * Creates a list of players to be then used in the player list in the frontend
     */
    public getAllPlayerList(): Object[]{
        let list = [];
        this.players.forEach((player:Player) => {
            let smallPlayer = {
                isAlive: player.alive(),
                name: player.getName()
            }
            list.push(smallPlayer);
        });
        return list;
    }

    /**
     * Send a question to every connected and alive player
     */
    private async sendQuestionToEveryone() : Promise<void> {
        console.log("Question number : " + this.nbQuestionsSent);
        let question = await this.qManager.newQuestion(false);
        //console.log(question);
        this.players.forEach((_player: Player, id: string) => {
            if(this.players.get(id).alive()){
                this.addQuestionToPlayer(id, question);
            }
        });
    }

    /**
     * Starts a loop that add a new question to player's queue every x seconds
     */
    public async sendTimedQuestionToEveryone() : Promise<void> {
        console.log("Sending questions to everyone!");
        setTimeout(async () => {
            await this.sendQuestionToEveryone();
        },1000); 
        //Wait a sec to be sure everyone has loaded the new page
        
        /*this.intervalId = setInterval(async () => {
            await this.sendQuestionToEveryone();
        }, this.TIME_BETWEEN_QUESTION);*/
        //this.sendTimedQuestion(this.TIME_BETWEEN_QUESTION);
        
        
        //setTimeout(this.sendTimedQuestion, this.TIME_BETWEEN_QUESTION);
        setTimeout(async () => {
            await this.sendTimedQuestion();
        },this.TIME_BETWEEN_QUESTION);
    }


    private async sendTimedQuestion(){

        await this.sendQuestionToEveryone();
        ++this.nbQuestionsSent;
        let level:number = 1;
        if(this.continueSending){
           
            if(this.nbQuestionsSent >= this.LEVEL4){
                level = this.LEVEL4_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL3){
                level = this.LEVEL3_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL2){
                level = this.LEVEL2_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL1){
                level = this.LEVEL1_t;
            }
            console.log("Next question in " + this.TIME_BETWEEN_QUESTION * level + "ms");
            //setTimeout(this.sendTimedQuestion, this.TIME_BETWEEN_QUESTION * level);
            setTimeout(async () => {
                await this.sendTimedQuestion();
            },this.TIME_BETWEEN_QUESTION * level);
        }
    }

    /**
     * Check if the player has to be eliminated from the game
     * @param player : player to verify
     * @returnes if the player is eliminated
     */
    public checkQuestionQueue(player: Player) : boolean {
        if (player.getNbQuestionsInQueue() >= this.SIZE_OF_QUESTION_QUEUE) {
            this.eliminatePlayer(player);

            return true;
        }
        return false;
    }

    /**
     * Ending game procedure : send the ranking to all players
     */
    public endGame() : void {
        //this.sendLeaderboard();
        this.players.forEach((player:Player)=>{
            if(player.alive()){
                player.unalive(1);
                this.leaderboard.push(new Rank(player, 1));
            }
        })

        this.server.emit("endGame");
        this.stopGame();
    }

    /**
     * Add a new question to the player's question queue
     * @param id : player id
     * @param question : question to add
     */
    public async addQuestionToPlayer(id: string, question: QuestionInQueue) {
        let player = this.players.get(id);
        if(!this.checkQuestionQueue(player)){
            player.addQuestion(question);
            let info = player.getUserInfo();
            this.server.to(player.getSocket().id).emit("userInfo", info);

            //Wait for the game to be started before sending question
            await this.waitForTheGameToBeStarted();
            //console.log(player.getCurrentQuestion());
            //Send question to player if queue was empty before

            this.server.to(player.getSocket().id).emit("newQuestion",this.qManager.get(player.getCurrentQuestion()));
            this.server.to(player.getSocket().id).emit("userInfo", info);

        }
    }

    public emitCurrentQuestionOf(player: Player){
        if(player.getCurrentQuestion() !== undefined){
            this.server.to(player.getSocket().id).emit("newQuestion",this.qManager.get(player.getCurrentQuestion()));
        }
    }

  /**
   * Add a new question to player triggered by an attack
   * @param attacker The player who attacks
   */
  public async attackPlayer(attacker: Player) : Promise<void> {
    let target = this.getOtherRandomPlayer(attacker);
    console.log("The target is " + target.getName());
    await this.addQuestionToPlayer(target.getId(), await this.qManager.newQuestion(true));
    // if(target.getCurrentQuestion() == undefined){
    //     target.nextQuestion();
    //     this.server.to(target.getSocket().id).emit("newQuestion",this.qManager.get(target.getCurrentQuestion()));
    //     this.server.to(target.getSocket().id).emit("userInfo", target.getUserInfo());
    //     target.addAnsweredQuestion();
    // }
      this.server.to(target.getSocket().id).emit("userInfo", target.getUserInfo());
  }

  /**
   * Check if the answer is correct and send a new question to player (if possible)
   * @param player : player who send the answer
   * @param answer : the answer number
   * @returns if the answer is correct or not
   */
  public checkPlayerAnswer(player:Player, answer:number){

      //console.log(this.qManager.get(player.getCurrentQuestion()).getQuestion());
    if(this.qManager.check(player.getCurrentQuestion(),answer)){
        //Correct answer
        
        player.correctAnswer();

        this.server.to(player.getSocket().id).emit("userInfo", player.getUserInfo());
        if(player.getCurrentQuestion() !== undefined){
            const qToSend = this.qManager.get(player.getCurrentQuestion());
            this.server.to(player.getSocket().id).emit("newQuestion",qToSend);
            player.addAnsweredQuestion();
        } else {
            this.server.to(player.getSocket().id).emit("noMoreQuestions");
        }
        return true;
    }
    else{
        //Bad answer
        player.addBadAnswer();
        player.resetStreak();
        this.server.to(player.getSocket().id).emit("userInfo", player.getUserInfo());
        return false;
    }
  }

    /**
     * Return a player object by the id
     * @param id the player's id
     * @returns Player object
     */
    public getPlayerById(id: string) : Player {
        return this.players.get(id);
    }

    /**
     * Send the leaderboard to all players
     */
    public sendLeaderboard() : void {
      this.server.emit("ranking", this.leaderboard);
    }

    public emitLeaderboardToPlayer(player: Player){
        player.getSocket().emit("ranking", this.leaderboard.reverse());
    }

    /**
     * Return a random alive player that isn't the attacker
     * @param attacker : player who attack
     * @private
     */
    public getOtherRandomPlayer(attacker:Player) : Player{
        let targetPlayer : Player;
        let map : Player[];
        map = [];
        let count = 0;


        this.players.forEach((player:Player) => {
            if(player.alive() && player.getId() != attacker.getId()){
                count++;
                map.push(player);
            }
        })
        const rnd = Math.floor(Math.random() * map.length);
        return map.at(rnd);
    }
    /**
     * Wait for the questionLoaded flag to be set to true
     */
    public async waitForTheGameToBeStarted() : Promise<boolean>{
        if (this.questionLoaded) return true;
        return new Promise((resolve) => {
            this.eventEmitter.once('loaded', () => resolve(true));
        });
    }

    /**
     * Eliminate a player from the game, send game over message
     * @param player : player to eliminate
     */
    private eliminatePlayer(player: Player) : void {
        if(player.alive()){
            player.unalive(this.nbPlayerAlive);
            console.log(player.getName() + " is dead");

            const rank = new Rank(player, this.nbPlayerAlive);
            this.leaderboard.push(rank);
            this.server.to(player.getId()).emit("gameOver", rank);
            if(--this.nbPlayerAlive === 1){

                this.endGame();
            }
        }
    }

    
}


