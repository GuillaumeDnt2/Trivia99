import { Player } from "./player";
import { QuestionManager } from "./questionManager";
import { Server } from "socket.io";
import { QuestionInQueue } from "./questionInQueue";
import {ConfigService} from "@nestjs/config";
import { EventEmitter } from 'events';

/**
 * Game class
 * Handles the game's logic and state
 * @class
 */
export class Game {
  private TIME_BETWEEN_QUESTION: number;
  private READY_PLAYERS_THRESHOLD: number;
  private NB_MIN_READY_PLAYERS: number;
  private SIZE_OF_QUESTION_QUEUE: number;
  public nbReady: number;
  private players: Map<string, Player>;
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
  }

  /**
   * Start the game and tells every connected socket that the game has started
   */
  public async startGame():Promise<void> {
    this.hasStarted = true;

    //Initialize the question manager
    this.qManager = new QuestionManager(this.configService);
    await this.qManager.initializeQuestions();
    this.questionLoaded = true;
    this.eventEmitter.emit("loaded");

    this.nbPlayerAlive = this.players.size;
    //Tell everyone the game has started
    this.server.emit("startGame", {
      msg: "The game has started",
    });
    //Starts the game loop
    await this.sendTimedQuestionToEveryone();
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
   * Check if the game has started
   * @returns {boolean} true if the game has started, false otherwise
   */
  public hasGameStarted(): boolean {
    return this.hasStarted;
  }

  /**
   * Stops the game and stops the game loop
   */
  public stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Get the number of questions in the question list
   */
  public getNbQuestions() {
    return this.qManager.qList.length;
  }

  /**
   * Add a player to the game
   * @param id the id of the player
   * @param name the name of the player
   */
  public addPlayer(id: string, name: string) {
    this.players.set(id, new Player(name));
  }

  public getPlayers() {
    return this.players;
  }

  public getNbPlayers() {
    return this.players.size;
  }

  public getNbReady() {
    return this.nbReady;
  }



  public async sendTimedQuestionToEveryone() {
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

  public checkDeadPlayer(player: Player) {
    if (player.getNbQuestions() > this.SIZE_OF_QUESTION_QUEUE) {
      player.kill();
      if(--this.nbPlayerAlive === 1){
        this.endGame();
      }
    }
  }

  public endGame(){
    this.sendRankingInfo();
  }

  public addQuestionToPlayer(id: string, question: QuestionInQueue) {
    let player = this.players.get(id);
    player.addQuestion(question);
    this.checkDeadPlayer(player);
    console.log("Question added to " + player.getName());
    let info = player.getUserInfo();
    this.server.to(id).emit("userInfo", {
      info: info,
    });
  }

  public async addAttackQuestionToPlayer(id: string) {
    this.addQuestionToPlayer(id, await this.qManager.newQuestion(true));
  }

  public getPlayerById(id: string) {
    return this.players.get(id);
  }

  public sendRankingInfo(){
    let ranking = [];
    for(let [key, value] of this.players){
        ranking.push({
            name: value.getName(),
            score: value.getScore()
        });
    }

    this.server.emit("ranking", {
      ranking,
    })
  }


  /**
   * Wait for the questionLoaded flag to be set to true
   */
  public async waitForTheGameToBeStarted() {
    if (this.questionLoaded) return true;
    return new Promise((resolve) => {
      this.eventEmitter.once('loaded', () => resolve(true));
    });
  }
}
