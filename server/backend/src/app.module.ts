import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TriviaGateway } from "./trivia/trivia.gateway";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {Game} from "./trivia/game";
import {Server} from "socket.io";
import {GameManager} from "./trivia/gameManager";

@Module({
  controllers: [AppController],
  imports: [ConfigModule.forRoot({
    isGlobal: true
  })],
  providers: [
    GameManager,
    {
        provide: Game,
        useValue: new Game(new Server(), new ConfigService(), new GameManager(new Server(), new ConfigService())),
    },
    AppService,
    TriviaGateway,
    {
      provide: Server,
      useValue: new Server(),
    }],
})
export class AppModule {}
