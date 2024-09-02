import { Question } from "./question";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import {ConfigService} from "@nestjs/config";
import { EventEmitter } from 'events';

import {Injectable} from "@nestjs/common";


@Injectable()
export class QuestionManager {
  private qPool: Map<string, Question>;

  public qList: Question[];
  private QUESTION_MIN: number;
  private Q_FETCH_SIZE: number;
  private API_URL: string;
  private waitingForFetch: boolean;
  private eventEmitter: any;

  constructor(private configService: ConfigService) {

    this.qPool = new Map<string, Question>();
    this.qList = [];
    this.waitingForFetch = false;
    this.eventEmitter = new EventEmitter();
 
    //Env variables
    this.QUESTION_MIN = parseInt(this.configService.get<string>("QUESTION_MIN"));
    this.Q_FETCH_SIZE = parseInt(this.configService.get<string>("Q_FETCH_SIZE"));
    this.API_URL = this.configService.get<string>("API_URL");
  }

  /**
   * Fetch trivia questions from API for the 1st time
   */
  async initializeQuestions() : Promise<void>{
      await this.fetchQuestions();
      console.log("length " + this.qList.length);
  }

  
  /**
   * Check the answer from a player
   * @param q Question to check the answer
   * @param answer Answer given by the player
   * @returns : if the answer is correct or not
   */
  public check(q: QuestionInQueue, answer: number) : boolean{
    if (!this.qPool.has(q.getId())) {
      throw new Error("Question is not yet present in the game");
    }
    let question = this.qPool.get(q.getId());
    return question.getCorrectAnswer() == answer;
  }

  /**
   * Obtain information about a question which will be sent
   * @param q The question for which we would like full information
   * @returns : QuestionToSend object (question text + 4 answers) 
   */
  public get(q: QuestionInQueue) : QuestionToSend{
    if(!this.qPool.has(q.getId())){
      return; //Do nothing
    }
    return new QuestionToSend(this.qPool.get(q.getId()), q.getIsAttack());
  }
  
  public async waitingForFetchToBeDone() {
    if (!this.waitingForFetch) return true;
    return new Promise((resolve) => {
      this.eventEmitter.once('questionLoaded', () => resolve(true));
    });
  }

  /**
   * Ask a new question to question Manager 
   * @param isAttack : if the new question is triggered by an attack
   * @returns : the new question without question text and answers (to be stored in player's queue)
   */
  public async newQuestion(isAttack: boolean) : Promise<QuestionInQueue>{
    let q: Question;
    do {
      if (this.qList.length < this.QUESTION_MIN) {
        await this.fetchQuestions();
      }
      q = this.qList.shift();
    } while (q && this.qPool.has(q.getId()));
    if(!q) return;
    this.qPool.set(q.getId(), q);
    return new QuestionInQueue(q, isAttack);
  }

  /**
   * Call the trivia api and fetch the questions to store them in the question list
   */
  private async fetchQuestions(): Promise<void> {
    try {
      if(this.waitingForFetch) return;
      this.waitingForFetch = true;
      const response = await fetch(this.API_URL + "&limit=" + this.Q_FETCH_SIZE);
      if (response.ok) {
        const questions: any[] = await response.json();
        questions.forEach((question: any) => {
          this.qList.push(new Question(question));
        });
      } else {
        const errorMessage = await response.text();
        console.error("Error fetching questions:", errorMessage);
      }
    } catch (err) {
      console.error("Error reading or parsing questions:", err);
      return Promise.resolve();
    }
    this.waitingForFetch = false;
    this.eventEmitter.emit('questionLoaded');
    return Promise.resolve();
  }

}
