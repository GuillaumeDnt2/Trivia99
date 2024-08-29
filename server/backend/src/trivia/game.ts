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

    /**
     * Game constructor
     * @constructor
     * @param server the server all the sockets are connected to
     * @param configService the configuration service to enable us to use the .env file
     */
    constructor(server: Server, private configService: ConfigService) {
        this.leaderboard = [];
        this.nbReady = 0;
        this.nbPlayerAlive = 0;
        this.players = new Map<string, Player>();
        this.hasStarted = false;
        this.server = server;
        this.configService = configService;
        this.questionLoaded = false;
        this.eventEmitter = new EventEmitter();

        // Load the configuration values from the .env file
        this.TIME_BETWEEN_QUESTION = parseInt(this.configService.get<string>("TIME_BETWEEN_QUESTION")) * 1000;
        this.READY_PLAYERS_THRESHOLD = parseInt(this.configService.get<string>("READY_PLAYERS_THRESHOLD"));
        this.NB_MIN_READY_PLAYERS = parseInt(this.configService.get<string>("NB_MIN_READY_PLAYERS"));
        this.SIZE_OF_QUESTION_QUEUE = parseInt(this.configService.get<string>("SIZE_OF_QUESTION_QUEUE"));
        this.eventEmitter = new EventEmitter();

        this.addPlayer("jeunet", "jean-pierre");this.nbPlayerAlive++;
        this.addPlayer("jarre", "jean-michel");this.nbPlayerAlive++;
        this.addPlayer("belmondo", "jean-paul");this.nbPlayerAlive++;

        this.eliminatePlayer(this.players.get("jeunet"));
        this.eliminatePlayer(this.players.get("jarre"));
        this.eliminatePlayer(this.players.get("belmondo"));

        console.log(this.leaderboard);
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
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    /**
     * Get how many questions have not yet been used
     * @returns nb of question
     */
    public getNbQuestions() : number {
        return this.qManager.qList.length;
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
   */
  public addPlayer(id: string, name: string) : void {
    this.players.set(id, new Player(name,id));
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

        await this.sendTimedQuestionToEveryone();
    }

    /**
     * Starts a loop that add a new question to player's queue every x seconds
     */
    public async sendTimedQuestionToEveryone() : Promise<void> {
        console.log("Sending questions to everyone!");
        this.intervalId = setInterval(async () => {
            console.log("Interval triggered");
            let question = await this.qManager.newQuestion(false);
            console.log("Question fetched");
            this.players.forEach((_player: Player, id: string) => {
                console.log("About to send");
                this.addQuestionToPlayer(id, question);
            });
        }, this.TIME_BETWEEN_QUESTION);
    }

    /**
     * Check if the player has to be eliminated from the game
     * @param player : player to verify
     * @returnes if the player is eleminated
     */
    public checkQuestionQueue(player: Player) : boolean {
        if (player.getNbQuestions() >= this.SIZE_OF_QUESTION_QUEUE) {
            
            this.eliminatePlayer(player);

            
            return true;
        }
        return false;
    }

    /**
     * Ending game procedure : send the ranking to all players
     */
    public endGame() : void {
        this.sendLeaderboard();
    }

    /**
     * Add a new question to the player's question queue
     * @param id : player id
     * @param question : question to add
     */
    public addQuestionToPlayer(id: string, question: QuestionInQueue) : void {
        let player = this.players.get(id);
        if(!this.checkQuestionQueue(player)){
            player.addQuestion(question);
            console.log("Question added to " + player.getName());
            let info = player.getUserInfo();
            this.server.to(id).emit("userInfo", {
                info: info,
            });
        }

    }

  /**
   * Add a new question to player triggered by an attack
   * @param id : player id
   */
  public async addAttackQuestionToPlayer(id: string) : Promise<void> {
    this.addQuestionToPlayer(id, await this.qManager.newQuestion(true));
  }

  /**
   * Check if the answer is correct and send a new question to player (if possible)
   * @param player : player who send the answer
   * @param answer : the answer number
   * @returns if the answer is correct or not
   */
  public checkPlayerAnswer(player:Player, answer:number){
    if(this.qManager.check(player.getCurrentQuestion(),answer)){
        //Correct answer
        
        player.correctAnswer();
        if(player.getNbQuestions() > 0){
            const qToSend = this.qManager.get(player.getCurrentQuestion());
            this.server.to(player.getId()).emit("newQuestion",qToSend);
            player.addAnsweredQuestion();
        }
        return true;
    }
    else{
        //Bad answer
        player.addBadAnswer();
        player.resetStreak();
        return false;
    }
  }

    /**
     * Return a player object by the id
     * @param id : player id
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
      player.unalive(this.nbPlayerAlive);
     
      const rank = new Rank(player, this.nbPlayerAlive);
      this.leaderboard.push(rank);
      this.server.to(player.getId()).emit("gameOver", rank);
      if(--this.nbPlayerAlive === 1){
        this.endGame();
      }
    }

    
}


