import { Game } from "./game";
import { Server } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GameManager {
  public game: Game;
  server: Server;
  configService: ConfigService;
  howManyGamesHaveFinished: number = 0;
  hasGameFinishedResetting: boolean = false;
  isGameResetting: boolean = false;

  constructor(server: Server, configService: ConfigService) {
    this.game = new Game(server, configService, this);
    this.server = server;
    this.configService = configService;
  }

  public getHowManyGamesHaveFinished() {
    return this.howManyGamesHaveFinished;
  }

  public async waitingGameReset() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.hasGameFinishedResetting) {
          this.hasGameFinishedResetting = false;
          resolve();
        }
      }, 1000);
    });
  }

  resetGame() {
    this.game = new Game(this.server, this.configService, this);
    ++this.howManyGamesHaveFinished;
    this.hasGameFinishedResetting = true;
  }

  resetGameIn60Seconds() {
    setTimeout(() => {
      this.resetGame();
    }, 60000);
  }
}
