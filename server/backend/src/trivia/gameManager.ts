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
  END_OF_GAME_RANKING_COOLDOWN: number;
  isGameResetting: boolean = false;

  constructor(server: Server, configService: ConfigService) {
    this.game = new Game(server, configService, this);
    this.server = server;
    this.configService = configService;
    this.END_OF_GAME_RANKING_COOLDOWN = parseInt(
      configService.get<string>("END_OF_GAME_RANKING_COOLDOWN"),
    );
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
    this.server.emit("gameReset")
  }

  resetGameInSomeTime() {
    setTimeout(() => {
      this.resetGame();
    }, this.END_OF_GAME_RANKING_COOLDOWN * 1000);
  }
}
