import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TriviaGateway } from "./trivia/trivia.gateway";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TriviaGateway],
})
export class AppModule {}
