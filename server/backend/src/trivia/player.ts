import { QuestionInQueue } from "./questionInQueue";
import {ConfigService} from "@nestjs/config";

export class Player {
  private name: string;
  private queue: QuestionInQueue[];
  private streak: number;
  private isAlive: boolean;
  public isReady: boolean;
  private nbBadAnswers: number;
  private nbGoodAnswers: number;
  private nbAnsweredQuestions: number;
  public isInTimeOut: NodeJS.Timeout;
  private id: string;
  private rank: number; 
  private currentSocket: any;
  private lastWrongAnswerTime: number;
  private currentQuestion: QuestionInQueue;
  //Configuration variables
  private STREAK: number;

  constructor(name: string, id:string, socket: any, private configService: ConfigService) {
    this.name = name;
    this.queue = [];
    this.streak = 0;
    this.isAlive = true;
    this.isReady = false;
    this.nbBadAnswers = 0;
    this.nbGoodAnswers = 0;
    this.nbAnsweredQuestions = 0;
    this.id = id;
    this.rank = 0;
    this.currentSocket = socket;
    this.lastWrongAnswerTime = 0;
    this.configService = configService;

    this.STREAK = parseInt(this.configService.get<string>("STREAK"));
  }

  /**
   * 
   * @returns Player id
   */
  public getId() : string{
    return this.id;
  }

  public updateWrongAnswerTime(){
    this.lastWrongAnswerTime = Date.now();
  }

  public getWrongAnswerTime(){
    return this.lastWrongAnswerTime;
  }

  /**
   * Return the 1st question in the question queue
   * @returns 
   */
  public getCurrentQuestion() {
    return this.currentQuestion;
  }

  public nextQuestion(): QuestionInQueue|void{
    console.log("Queue length of " + this.name + ": " + this.queue.length)

    this.queue.forEach((question: any) => {
      console.log(question.isAttack)
        });

    if(this.queue.length > 0){
      this.currentQuestion = this.queue.shift();
      return this.getCurrentQuestion();
    } else {
      this.currentQuestion = undefined;
    }
  }

  /**
   * Return the nb of question in the question queue
   * @returns 
   */
  public getNbQuestionsInQueue() {
    return this.queue.length;
  }

  /**
   * Unalive the player
   */
  public unalive(rank:number) {
    this.isAlive = false;
    this.rank = rank;
  }

  /**
   * Reset the good answer streak to zero
   */
  public resetStreak() {
    this.streak = 0;
  }

  /**
   * Increment the value of the streak
   */
  public incrementStreak() {
    ++this.streak;
  }

  /**
   * Return the value of the streak
   * @returns 
   */
  public getStreak() {
    return this.streak;
  }

  /**
   * Add a new question to the question queue
   * @param question 
   */
  public addQuestion(question: any) {
    if(this.currentQuestion == undefined){
      this.currentQuestion = question;
    } else {
      this.queue.push(question);
    }
  }

  /**
   * Remove the first question from the question queue 
   */
  public removeQuestion() {
    this.queue.shift();
  }

  /**
   * Get player statistics and question queue
   * @returns 
   */
  public getUserInfo(): object {
    let info = {
      streak: this.streak,
      canAttack: this.streak >= this.STREAK,
      isAlive: this.isAlive,
      nbBadAnswers: this.nbBadAnswers,
      nbGoodAnswers: this.nbGoodAnswers,
      nbAnsweredQuestions: this.nbAnsweredQuestions,
      rank: this.rank,
      questions: this.queue
    };

    // this.queue.forEach((question: any) => {
    //   info.questions.push(question);
    // });
    //


    return info;
  }

  public correctAnswer() : void {
    this.nextQuestion();
    this.addGoodAnswer();
    this.incrementStreak();
  }

  /**
   * Change the socket of the player
   * @param socket to change to
   */
  public changeSocket(socket: any) {
    this.currentSocket = socket;
  }

    /**
     * Get the current socket of the player
     * @returns
     */
  public getSocket() {
    return this.currentSocket;
  }

  /**
   * Get player's name
   * @returns 
   */
  public getName() {
    return this.name;
  }

  /**
   * Return player's number of good answers
   * @returns 
   */
  public getScore() {
    return this.nbGoodAnswers;
  }

  /**
   * Return the state of the player 
   * @returns 
   */
  public alive() {
    return this.isAlive;
  }

  public getAnsweredQuestion() : number {
    return this.nbAnsweredQuestions;
  }

  public getGoodAnswers() : number {
    return this.nbGoodAnswers;
  }

  public getBadAnswers() : number {
    return this.nbBadAnswers;
  }

  public addAnsweredQuestion() : void {
    this.nbAnsweredQuestions++;
  }
  public addBadAnswer() : void {
    this.nbBadAnswers++;
  }

  public addGoodAnswer() : void {
    this.nbGoodAnswers++;
  }

}
