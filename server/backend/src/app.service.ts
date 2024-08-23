import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Welcome to the trivia99's API, are you sure you're supposed to be here? :3";
  }
}
