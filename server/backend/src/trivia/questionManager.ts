import { Question } from "./question";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import {ConfigService} from "@nestjs/config";
import { parse } from "dotenv";

import {Injectable} from "@nestjs/common";


@Injectable()
export class QuestionManager {
  private qPool: Map<string, Question>;

  public qList: Question[];
  private QUESTION_MIN: number;
  private Q_FETCH_SIZE: number;
  private API_URL: string;
  constructor(private configService: ConfigService) {

    this.qPool = new Map<string, Question>();
    this.qList = [];
 
    //Env variables
    this.QUESTION_MIN = parseInt(this.configService.get<string>("QUESTION_MIN"));
    this.Q_FETCH_SIZE = parseInt(this.configService.get<string>("Q_FETCH_SIZE"));
    this.API_URL = this.configService.get<string>("API_URL");
  }

  async initializeQuestions() {
    await this.fetchQuestions(this.Q_FETCH_SIZE);
    console.log("length " + this.qList.length);
 
  }

  

  public check(q: QuestionInQueue, answer: number) {
    if (!this.qPool.has(q.id)) {
      throw new Error("Question is not yet present in the game");
    }
    let question = this.qPool.get(q.id);
    return question.correctAnsw == answer;
  }

  public get(q: QuestionInQueue) {
    return new QuestionToSend(this.qPool.get(q.id), q.isAttack);
  }

  public async newQuestion(isAttack: boolean) {
    let q: Question;
    do {
      if (this.qList.length < this.QUESTION_MIN) {
        await this.fetchQuestions(this.Q_FETCH_SIZE);
      }
      q = this.qList.shift();
    } while (this.qPool.has(q.id));

    return new QuestionInQueue(q, isAttack);
  }

  private async fetchQuestions(limit: number) {
    const fs = require("fs");
    let questions: any[] = [];
    let data: any;
    try {
      await fetch(this.API_URL)
        .then((response) => response.json())
        .then((json) => {
          questions = json;
          questions.forEach((question: any) => {
            this.qList.push(new Question(question));
            
          });
        });
  
    } catch (err) {
      console.error("Error reading or parsing questions:", err);
    }
  }
}
