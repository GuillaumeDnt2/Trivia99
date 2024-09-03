import { Player } from "./player";
import { QuestionManager } from "./questionManager";
import { Server } from "socket.io";
import { QuestionInQueue } from "./questionInQueue";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter } from "events";
import { GameManager } from "./gameManager";
/**
 * Save the final player's stats and rank about the game
 */
class Rank {
  playerid: string;
  playerName: string;
  rank: number;
  goodAnswers: number;
  badAnswers: number;
  answeredQuestions: number;

  constructor(player: Player, rank: number) {
    this.playerid = player.getId();
    this.playerName = player.getName();
    this.rank = rank;
    this.goodAnswers = player.getGoodAnswers();
    this.badAnswers = player.getBadAnswers();

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
    private hasEnded: boolean;
    private qManager: QuestionManager;
    private server: Server;
    private questionLoaded: boolean;
    private eventEmitter: any;

    private nbQuestionsSent:number;
    private continueSending:boolean;
 

    private readonly configService: ConfigService;
    private gameManager : GameManager;


    /**
     * Game constructor
     * @constructor
     * @param server the server all the sockets are connected to
     * @param configService the configuration service to enable us to use the .env file
     * @param gameManager
     */
    constructor(server: Server, configService: ConfigService, gameManager: GameManager) {

        this.nbReady = 0;
        this.nbPlayerAlive = 0;
        this.players = new Map<string, Player>();
        this.hasStarted = false;
        this.hasEnded = false;
        this.server = server;
        this.configService = configService;
        this.gameManager = gameManager;
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

    }

  /**
   * Ask if game has started
   * @returns : true/false
   */
  public hasGameStarted(): boolean {
    return this.hasStarted;
  }

  /**
   * Stop sending question to players and ask the game manager to reset the game in 60 seconds
   */
  public async stopGame(): Promise<void> {
    await this.forceStopGame();
    this.gameManager.resetGameInSomeTime();
  }

  /**
   * Stop sending question to players
   */
  public async forceStopGame(): Promise<void> {
    this.continueSending = false;
    if(this.qManager !== undefined) {
        await this.qManager.waitForQuestionsToBeFetched();
    }
  }

  /**
   * Get how many questions have not yet been used
   * @returns nb of question
   */
  public getNbQuestions(): number {
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
  public addPlayer(id: string, name: string, socket: any): Player {
    let player = new Player(name, id, socket, this.configService);
    this.players.set(id, player);
    this.sendFeedUpdate(name + " joined the game");
    return player;
  }

  public removePlayer(player: Player): void {
    this.players.delete(player.getId());
  }

  /**
   * Return the players map
   * @returns Map of players
   */
  public getPlayers(): Map<string, Player> {
    return this.players;
  }

  /**
   * Get how many players connected to the game (empêcher de faire gagner un joueur qui n'a pas joué (quitté après ready))
   * @returns
   */
  public getNbPlayers(): number {
    return this.players.size;
  }

  /**
   * Get how many players are still alive in the current running game
   */
  public getNbPlayerAlive(): number {
    return this.nbPlayerAlive;
  }

  /**
   * Get how many players are ready to start the game
   * @returns : how many ready players
   */
  public getNbReady(): number {
    return this.nbReady;
  }

  public getGameStatus(): string {
    let answer: string;
    if (this.hasGameStarted()) {
      answer = "started";
    } else if (this.hasGameEnded()) {
      answer = "ended";
    } else {
      answer = "waiting";
    }

    return answer;
  }

  /**
   * Starting game procedure : create the question manager and fetch new questions
   */
  public async startGame(): Promise<void> {
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

    this.leaderboard = [];
  }
  /**
   * Creates a list of players to be then used in the player list in the frontend
   */
  public getAllPlayerList(): Object[] {
    let list = [];
    this.players.forEach((player: Player) => {
      let smallPlayer = {
        isAlive: player.alive(),
        name: player.getName(),
      };
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
   
        setTimeout(async () => {
            await this.sendTimedQuestion();
        },this.TIME_BETWEEN_QUESTION);
    }

    /**
     * Set a timeout to wait the right amount of time to send the next question
     */
    private async sendTimedQuestion(){

        await this.sendQuestionToEveryone();
        ++this.nbQuestionsSent;
        let modifier:number = 1;
        if(this.continueSending){
            //Chose a modifier related to the amount of question sent
            if(this.nbQuestionsSent >= this.LEVEL4){
                modifier = this.LEVEL4_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL3){
                modifier = this.LEVEL3_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL2){
                modifier = this.LEVEL2_t;
            }
            else if(this.nbQuestionsSent >= this.LEVEL1){
                modifier = this.LEVEL1_t;
            }
            
            setTimeout(async () => {
                await this.sendTimedQuestion();
            },this.TIME_BETWEEN_QUESTION * modifier);
        }
    }

    /**
     * Check if the player has to be eliminated from the game
     * @param player : player to verify
     * @returnes if the player is eliminated
     */
    public isQueueFull(player: Player) : boolean {
        return player.getNbQuestionsInQueue() >= this.SIZE_OF_QUESTION_QUEUE;
    }

  /**
   * Ending game procedure : send the ranking to all players
   */
  public endGame(): void {
    //this.sendLeaderboard();
    this.players.forEach((player: Player) => {
      if (player.alive()) {
        player.unalive(1);
        this.leaderboard.push(new Rank(player, 1));
      }
    });

    this.server.emit("endGame");
    this.hasStarted = false;
    this.hasEnded = true;
    this.stopGame();
  }

  public hasGameEnded(): boolean {
    return this.hasEnded;
  }


    /**
     * Add a new question to the player's question queue
     * @param id : player id
     * @param question : question to add
     */
    public async addQuestionToPlayer(id: string, question: QuestionInQueue) {
        let player = this.players.get(id);
        if(!this.isQueueFull(player)){
            player.addQuestion(question);
            let info = player.getUserInfo();
            this.server.to(player.getSocket().id).emit("userInfo", info);

            //Wait for the game to be started before sending question
            await this.waitForTheGameToBeStarted();

            this.emitCurrentQuestionOf(player);
            this.server.to(player.getSocket().id).emit("userInfo", info);

        }
        else{
            this.eliminatePlayer(player);
        }
    }


    /**
     * Send the current question to the player
     * @param player 
     */
    public emitCurrentQuestionOf(player: Player){
        if(player.getCurrentQuestion() !== undefined){
            this.server.to(player.getSocket().id).emit("newQuestion",this.qManager.get(player.getCurrentQuestion()));
        }
        else{
            this.server.to(player.getSocket().id).emit("noMoreQuestions");
        }
    }


  /**
   * Add a new question to player triggered by an attack
   * @param attacker The player who attacks
   */
  public async attack(attacker: Player) : Promise<void> {
    let target = this.getRandomPlayer(attacker);
    
    await this.addQuestionToPlayer(target.getId(), await this.qManager.newQuestion(true));
   
    this.sendFeedUpdate("You have been attacked by " + attacker.getName(), target);
    this.server.to(target.getSocket().id).emit("userInfo", target.getUserInfo());
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

        this.server.to(player.getSocket().id).emit("userInfo", player.getUserInfo());
        this.emitCurrentQuestionOf(player);
        return true;
    }
    else{
        //Bad answer
        player.badAnswer();
        this.server.to(player.getSocket().id).emit("userInfo", player.getUserInfo());
        return false;
    }
  }

  /**
   * Return a player object by the id
   * @param id the player's id
   * @returns Player object
   */
  public getPlayerById(id: string): Player {
    return this.players.get(id);
  }

  /**
   * Send the leaderboard to all players
   */
  public sendLeaderboard(): void {
    this.server.emit("ranking", this.leaderboard);
  }

  public emitLeaderboardToPlayer(player: Player) {
    player.getSocket().emit("ranking", this.leaderboard.reverse());
  }


    /**
     * Return a random alive player that isn't the attacker
     * @param attacker : player who attack
     * @private
     */
    public getRandomPlayer(attacker:Player) : Player{
        
        //Make a list of player that can be attacked (alive and not the attacker)
        let availablePlayers : Player[];
        availablePlayers = [];
        this.players.forEach((player:Player) => {
            if(player.alive() && player.getId() != attacker.getId()){
                availablePlayers.push(player);
            }
        });
        //Choose a random player from this list
        const rnd = Math.floor(Math.random() * availablePlayers.length);
        return availablePlayers.at(rnd);
    }

    /**
     * Wait for the question to be loaded
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
            this.sendFeedUpdate(player.getName() + " has been eliminated");
            //Create the final stats for the player
            const rank = new Rank(player, this.nbPlayerAlive);
            //Add the player result to the leaderboard and send the a game over message
            this.leaderboard.push(rank);
            this.server.to(player.getId()).emit("gameOver", rank);
            //End the game if there is one player left
            if(--this.nbPlayerAlive === 1){

                this.endGame();
            }
        }
    }

    /**
     * Send a message to all sockets about events occuring during the game
     * @param text 
     */
    public sendFeedUpdate(text:string, player=undefined) : void{
        //Send a message to one player or everyone
        if(player != undefined){
            this.server.to(player.getSocket().id).emit("feedUpdate", text);
        }
        else{
            this.server.emit("feedUpdate", text);
        }

    }
}
