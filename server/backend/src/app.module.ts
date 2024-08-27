import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TriviaGateway } from "./trivia/trivia.gateway";
import { ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  })],
  controllers: [AppController],
  providers: [AppService, TriviaGateway],
})
export class AppModule {}
