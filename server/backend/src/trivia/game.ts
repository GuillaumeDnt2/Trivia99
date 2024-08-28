import { Player } from "./player";
import { QuestionManager } from "./questionManager";
import { Server } from "socket.io";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { EventEmitter } from 'events';

@Injectable()
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

  constructor(server: Server, private configService: ConfigService) {
    this.nbReady = 0;
    this.nbPlayerAlive = 0;
    this.players = new Map<string, Player>();
    this.hasStarted = false;
    this.server = server;
    this.configService = configService;
    this.questionLoaded = false;
    this.TIME_BETWEEN_QUESTION = parseInt(this.configService.get<string>("TIME_BETWEEN_QUESTION")) * 1000;
    this.READY_PLAYERS_THRESHOLD = parseInt(this.configService.get<string>("READY_PLAYERS_THRESHOLD"));
    this.NB_MIN_READY_PLAYERS = parseInt(this.configService.get<string>("NB_MIN_READY_PLAYERS"));
    this.SIZE_OF_QUESTION_QUEUE = parseInt(this.configService.get<string>("SIZE_OF_QUESTION_QUEUE"));
    this.eventEmitter = new EventEmitter();
 
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
   * Check how many players are ready to start the game, starts game if the nb of players is satisfied
   */
  public checkAndStartGame() : void {
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
    this.players.set(id, new Player(name, id));

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
  public async sendTimedQuestionToEveryone() {
    
    setInterval(async () => {
      let question = await this.qManager.newQuestion(false);
      this.players.forEach((_player: Player, id: string) => {
        
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
      player.kill();
      if(--this.nbPlayerAlive === 1){
        this.endGame();
      }
      return true;
    }
  }

  /**
   * Ending game procedure : send the ranking to all players
   */
  public endGame() : void {
    this.sendRankingInfo();
  }

  /**
   * Add a new question to the player's question queue
   * @param id : player id
   * @param question : question to add
   */
  public addQuestionToPlayer(id: string, question: QuestionInQueue) {
    let player = this.players.get(id);
    player.addQuestion(question);
    this.checkDeadPlayer(player);
    console.log("Question added to " + player.getName());
    let info = player.getUserInfo();
    this.server.to(id).emit("userInfo", {
      info: info,
    });
    //Send question to player if queue was empty before
    if(player.getNbQuestions() == 1){
      this.server.to(id).emit("newQuestion",this.qManager.get(question));
      player.addAnsweredQuestion();
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
   * Return a player object by the id
   * @param id : player id
   * @returns Player object
   */
  public getPlayerById(id: string) : Player {
    return this.players.get(id);
  }

  /**
   * Make the ranking and send it to all players
   */
  public sendRankingInfo() : void {
    //TODO ranking trié du 1er au dernier joueur
    let ranking = [];
    for(let [key, value] of this.players){
        ranking.push({
            name: value.getName(),
            score: value.getScore()
        });
    }

    this.server.emit("ranking", ranking);
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
        player.removeQuestion();
        player.addGoodAnswer();
        player.incrementStreak();
        if(player.getNbQuestions() > 0){
            const qToSend = this.qManager.get(player.getCurrentQuestion());
            this.server.to(player.getSocket()).emit("newQuestion",qToSend);
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
   * Wait for the questionLoaded flag to be set to true
   */
  public async waitForTheGameToBeStarted() : Promise<boolean>{
    if (this.questionLoaded) return true;
    return new Promise((resolve) => {
      this.eventEmitter.once('loaded', () => resolve(true));
    });
  }
}
