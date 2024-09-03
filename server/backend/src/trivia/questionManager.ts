import { Question } from "./question";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { ConfigService } from "@nestjs/config";

import { Injectable } from "@nestjs/common";

@Injectable()
export class QuestionManager {
  private qPool: Map<string, Question>;

  private QUESTION_MIN: number;
  private Q_FETCH_SIZE: number;
  private HARD_Q: number;
  private MEDIUM_Q: number;
  private API_URL: string;
  public easy_questions: Question[];
  public medium_questions: Question[];
  public hard_questions: Question[];

  constructor(private configService: ConfigService) {
    this.qPool = new Map<string, Question>();

    this.easy_questions = [];
    this.medium_questions = [];
    this.hard_questions = [];

    //Env variables
    this.QUESTION_MIN = parseInt(
      this.configService.get<string>("QUESTION_MIN"),
    );
    this.Q_FETCH_SIZE = parseInt(
      this.configService.get<string>("Q_FETCH_SIZE"),
    );
    this.HARD_Q = parseInt(this.configService.get<string>("HARD_QUESTION"));
    this.MEDIUM_Q = parseInt(this.configService.get<string>("MEDIUM_QUESTION"));
    this.API_URL = this.configService.get<string>("API_URL");
  }

  /**
   * Fetch trivia questions from API for the 1st time
   */
  async initializeQuestions(): Promise<void> {
    //this.qList = await this.fetchQuestions();
    this.easy_questions = await this.fetchQuestions("easy");
    this.medium_questions = await this.fetchQuestions("medium");
    this.hard_questions = await this.fetchQuestions("hard");
  }

  getUnusedQuestions(): number {
    return (
      this.easy_questions.length +
      this.medium_questions.length +
      this.hard_questions.length
    );
  }

  /**
   * Check the answer from a player
   * @param q : Question to check the answer
   * @param answer : Answer given by the player
   * @returns : if the answer is correct or not
   */
  public check(q: QuestionInQueue, answer: number): boolean {
    if (!this.qPool.has(q.getId())) {
      throw new Error("Question is not yet present in the game");
    }
    let question = this.qPool.get(q.getId());
    return question.getCorrectAnswer() == answer;
  }

  /**
   * Obtain information about a question which will be send
   * @param q : The question for which we would like full information
   * @returns : QuestionToSend object (question text + 4 answers)
   */
  public get(q: QuestionInQueue): QuestionToSend {
    if (!this.qPool.has(q.getId())) {
      return; //Do nothing
    }
    return new QuestionToSend(this.qPool.get(q.getId()), q.getIsAttack());
  }

  /**
   * Ask a new question to question Manager
   * @param isAttack : if the new question is triggered by an attack
   * @returns : the new question without question text and answers (to be stored in player's queue)
   */
  public async newQuestion(isAttack: boolean): Promise<QuestionInQueue> {
    let rnd = Math.floor(Math.random() * 10);

    let q: Question;
    if (rnd >= this.HARD_Q || isAttack) {
      do {
        if (this.hard_questions.length < this.QUESTION_MIN) {
          await this.fetchQuestions("hard");
        }
        q = this.hard_questions.shift();
      } while (this.qPool.has(q.getId()));
    } else if (rnd >= this.MEDIUM_Q) {
      do {
        if (this.medium_questions.length < this.QUESTION_MIN) {
          await this.fetchQuestions("medium");
        }
        q = this.medium_questions.shift();
      } while (this.qPool.has(q.getId()));
    } else {
      do {
        if (this.easy_questions.length < this.QUESTION_MIN) {
          await this.fetchQuestions("easy");
        }
        q = this.easy_questions.shift();
      } while (this.qPool.has(q.getId()));
    }

    this.qPool.set(q.getId(), q);
    return new QuestionInQueue(q, isAttack);
  }

  /**
   * Call the trivia api and fetch the questions to store them in the question list
   */
  private async fetchQuestions(difficulty = undefined): Promise<Question[]> {
    let url = this.API_URL + "?limit=" + this.Q_FETCH_SIZE;
    if (difficulty != undefined) {
      url += "&difficulties=" + difficulty;
    }

    const fs = require("fs");
    let questions: any[] = [];

    let list: Question[] = [];
    try {
      await fetch(url)
        .then((response) => response.json())
        .then((json) => {
          questions = json;
          questions.forEach((question: any) => {
            list.push(new Question(question));
          });
        });

      return list;
    } catch (err) {
      console.error("Error reading or parsing questions:", err);
    }
  }
}
