import { Question } from "./question";
import { QuestionToSend } from "./questionToSend";
import { QuestionInQueue } from "./questionInQueue";
import { ConfigService } from "@nestjs/config";

import { Injectable } from "@nestjs/common";
import {EventEmitter} from "events";

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
  public isFetching: boolean = false;
  public isFetchingEasy: boolean = false;
    public isFetchingMedium: boolean = false;
    public isFetchingHard: boolean = false;
  private eventEmitter: EventEmitter;

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


    this.eventEmitter = new EventEmitter();
  }

  /**
   * Fetch trivia questions from API for the 1st time
   */
  async initializeQuestions(): Promise<void> {
    //this.qList = await this.fetchQuestions();
    this.easy_questions = await this.fetchQuestions("easy");
    this.medium_questions = await this.fetchQuestions("medium");
    this.hard_questions = await this.fetchQuestions("hard");

    this.eventEmitter.emit("questionsFetched");
  }

  async waitForEasyQuestionsToBeFetched(): Promise<void> {
    if(!this.isFetchingEasy) {
      return Promise.resolve();
    }

    console.log("Waiting for easy questions to be fetched");
      return new Promise((resolve) => {
        this.eventEmitter.once('easyQuestionsFetched', () =>
        {
          console.log("Easy questions fetched");
            resolve();
        });
      });
  }

    async waitForMediumQuestionsToBeFetched(): Promise<void> {
        if(!this.isFetchingMedium) {
        return Promise.resolve();
        }
      console.log("Waiting for medium questions to be fetched");
        return new Promise((resolve) => {
            this.eventEmitter.once('mediumQuestionsFetched', () =>
            {
              console.log("Medium questions fetched");
              resolve();
            });
        });
    }

    async waitForHardQuestionsToBeFetched(): Promise<void> {
        if(!this.isFetchingHard) {
        return Promise.resolve();
        }
      console.log("Waiting for hard questions to be fetched");
        return new Promise((resolve) => {
            this.eventEmitter.once('hardQuestionsFetched', () =>
            {
              console.log("Hard questions fetched");
              resolve();
            });
        });
    }

  async waitForQuestionsToBeFetched(): Promise<void> {
    if(!this.isFetching) {
      return Promise.resolve();
    }
      return new Promise((resolve) => {
        this.eventEmitter.once('questionFetched', () => resolve());
      });

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
    let q: Question | undefined;

    const fetchAndGetQuestion = async (
        questionArray: Question[],
        difficulty: string
    ): Promise<Question | undefined> => {
      if (questionArray.length < this.QUESTION_MIN) {
        if (difficulty == "hard") {
          //console.log("A hard question is missing, fetching more");
          this.isFetchingHard = true;
        } else if (difficulty == "medium") {
            //console.log("A medium question is missing, fetching more");
          this.isFetchingMedium = true;
        } else {
            //console.log("An easy question is missing, fetching more");
          this.isFetchingEasy = true;
        }
        //console.log("Fetching questions");
        questionArray = await this.fetchQuestions(difficulty);

      }
      return questionArray.shift();
    };


    do {
      //console.log("Checking if we need to fetch");
      if((rnd >= this.HARD_Q || isAttack) && this.isFetchingHard){
        await this.waitForHardQuestionsToBeFetched();
      } else if((rnd >= this.MEDIUM_Q) && this.isFetchingMedium){
        await this.waitForMediumQuestionsToBeFetched();
      } else if(this.isFetchingEasy) {
        await this.waitForEasyQuestionsToBeFetched();
      }

      if (rnd >= this.HARD_Q || isAttack) {
        if(this.isFetchingHard) continue;
        q = await fetchAndGetQuestion(this.hard_questions, "hard");
      } else if (rnd >= this.MEDIUM_Q) {
        if(this.isFetchingMedium) continue;
        q = await fetchAndGetQuestion(this.medium_questions, "medium");
      } else {
        if(this.isFetchingEasy) continue;
        q = await fetchAndGetQuestion(this.easy_questions, "easy");
      }

      // If we couldn't get a question, wait a bit and try again
      if (!q) {
        //console.log("No question fetched, waiting a bit");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (!q || this.qPool.has(q.getId()));

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



    //console.log("Fetching questions with difficulty: " + difficulty);

    let list: Question[] = [];
    this.isFetching = true;
    try {
      const response = await fetch(url);
      const json = await response.json();
      list = json.map((question: any) => new Question(question));

      //console.log(`Fetched ${list.length} questions with difficulty: ${difficulty}`);
      //this.eventEmitter.emit("questionsFetched");
      //this.eventEmitter.emit(difficulty + "QuestionsFetched");
      if(difficulty == "easy") {
        this.isFetchingEasy = false;
        this.eventEmitter.emit("easyQuestionsFetched");
      } else if(difficulty == "medium") {
        this.isFetchingMedium = false;
        this.eventEmitter.emit("mediumQuestionsFetched");
      } else if(difficulty == "hard") {
        this.isFetchingHard = false;
        this.eventEmitter.emit("hardQuestionsFetched");
      }

      return list;
    } catch (err) {
      console.error("Error fetching or parsing questions:", err);
      return []; // Return an empty array instead of undefined
    } finally {
      this.isFetching = false;
    }
  }
}
