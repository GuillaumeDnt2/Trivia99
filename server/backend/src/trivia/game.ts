import { Player } from "./player";
import { QuestionManager } from "./questionManager";
import { Server } from "socket.io";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class Game {
  private TIME_BETWEEN_QUESTION: number;
  private READY_PLAYERS_THRESHOLD: number;
  private NB_READY_PLAYERS: number;
  private SIZE_OF_QUESTION_QUEUE: number;
  public nbReady: number;
  private players: Map<string, Player>;
  private hasStarted: boolean;
  private qManager: QuestionManager;
  private server: Server;

  constructor(server: Server, private configService: ConfigService) {
    this.nbReady = 0;
    this.players = new Map<string, Player>();
    this.hasStarted = false;
    this.server = server;
    this.configService = configService;
    this.TIME_BETWEEN_QUESTION = parseInt(this.configService.get<string>("TIME_BETWEEN_QUESTION")) * 1000;
    this.READY_PLAYERS_THRESHOLD = parseInt(this.configService.get<string>("READY_PLAYERS_THRESHOLD"));
    this.NB_READY_PLAYERS = parseInt(this.configService.get<string>("NB_READY_PLAYERS"));
    this.SIZE_OF_QUESTION_QUEUE = parseInt(this.configService.get<string>("SIZE_OF_QUESTION_QUEUE"));
    // qList est vide à se moment donc erreur
    //let qiq = this.qManager.newQuestion(false);
    //console.log(qiq);
    /*let qq = this.qManager.get(qiq);
        console.log("Question to send: ");
        console.log(qq);*/
    //console.log(this.qManager.check(qiq, 1));
  }

  public hasGameStarted() {
    return this.hasStarted;
  }

  public getNbQuestions() {
    return this.qManager.qList.length;
  }

  public checkAndStartGame() {
    if (!this.hasStarted) {
      if (
        this.getNbReady() >= this.NB_READY_PLAYERS &&
        this.getNbReady() >= this.players.size * this.READY_PLAYERS_THRESHOLD
      ) {
        this.startGame().then(() => console.log("Game started"));
      }
    }
  }

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

  public async startGame() {
    this.hasStarted = true;

    this.qManager = new QuestionManager(this.configService);
    await this.qManager.initializeQuestions();

    this.server.emit("startGame", {
      msg: "The game has started",
    });

    this.sendTimedQuestionToEveryone().then((r) => {
      console.log("Questions sent");
    });
  }

  public async sendTimedQuestionToEveryone() {
    // Send the question to everyone every 10 seconds
    setInterval(async () => {
      let question = await this.qManager.newQuestion(false);
      this.players.forEach((_player: Player, id: string) => {
        this.addQuestionToPlayer(id, question);
      });
    }, this.TIME_BETWEEN_QUESTION);
  }

  public checkDeadPlayers() {
    this.players.forEach((player: Player, id: string) => {
      if (player.getNbQuestions() > 0) {
      } else {
        player.kill();
      }
    });
  }

  public addQuestionToPlayer(id: string, question: QuestionInQueue) {
    let player = this.players.get(id);
    player.addQuestion(question);
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
      ranking: ranking,
    })
  }


}
