import { Question } from "./question";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { Queue } from "./queue";

const QUESTION_MIN = 3;
const Q_FETCH_SIZE = 50;
const API_URL = "https://the-trivia-api.com/v2/questions?limit=50";

export class QuestionManager {
  private qPool: Map<string, Question>;
  private questionList: Queue;
  public qList: Question[];

  constructor() {
    this.qPool = new Map<string, Question>();
    this.questionList = new Queue();
    this.qList = [];

    //this.initializeQuestions();
  }

  async initializeQuestions() {
    await this.fetchQuestions(Q_FETCH_SIZE);
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
      if (this.qList.length < QUESTION_MIN) {
        await this.fetchQuestions(Q_FETCH_SIZE);
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
      await fetch(API_URL)
        .then((response) => response.text())
        .then((text) => {
          questions = JSON.parse(text);
          questions.forEach((question: any) => {
            console.log(new Question(question));
            //this.questionList.add(new Question(question));
            this.qList.push(new Question(question));
            console.log(this.qList.length);
          });
        });
    } catch (err) {
      console.error("Error reading or parsing questions:", err);
    }
  }
}
