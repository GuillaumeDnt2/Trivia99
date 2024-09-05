import { Game } from "./game";
import { Server } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

/**
 * This class is the GameManager, it is responsible for managing the game.
 * In this version, it's only used to reset the game when it's finished.
 *
 * @class GameManager
 * @Authors : Neroil, Tasticoco, VBonzon et GuillaumeDnt2
 */
@Injectable()
export class GameManager {
  public game: Game;
  server: Server;
  configService: ConfigService;
  howManyGamesHaveFinished: number = 0;
  hasGameFinishedResetting: boolean = false;
  END_OF_GAME_RANKING_COOLDOWN: number;

  constructor(server: Server, configService: ConfigService) {
    this.game = new Game(server, configService, this);
    this.server = server;
    this.configService = configService;
    this.END_OF_GAME_RANKING_COOLDOWN = parseInt(
      configService.get<string>("END_OF_GAME_RANKING_COOLDOWN"),
    );
  }

  /**
   * Returns the number of games that have finished.
   */
  public getHowManyGamesHaveFinished() {
    return this.howManyGamesHaveFinished;
  }

  /**
   * Resets the game by creating a new game.
   */
  resetGame() {
    this.game = new Game(this.server, this.configService, this);
    ++this.howManyGamesHaveFinished;
    this.hasGameFinishedResetting = true;
    this.server.emit("gameReset");
  }

  /**
   * Resets the game in some time given by the END_OF_GAME_RANKING_COOLDOWN parameter in the .env file.
   */
  resetGameInSomeTime() {
    setTimeout(() => {
      this.resetGame();
    }, this.END_OF_GAME_RANKING_COOLDOWN * 1000);
  }
}
