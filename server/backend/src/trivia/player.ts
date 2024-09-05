import { QuestionInQueue } from "./questionInQueue";
import { ConfigService } from "@nestjs/config";

/**
 * This class is a Player.
 * It has all necessary attributes and methods to manage a player.
 *
 * @class Player
 * @Authors : Neroil, Tasticoco, VBonzon et GuillaumeDnt2
 */
export class Player {
  private readonly name: string;
  private readonly id: string;
  private queue: QuestionInQueue[];
  private streak: number;
  private isAlive: boolean;
  public isReady: boolean;
  private nbBadAnswers: number;
  private nbGoodAnswers: number;
  public isInTimeOut: NodeJS.Timeout;
  private rank: number;
  private currentSocket: any;
  private lastWrongAnswerTime: number;
  private currentQuestion: QuestionInQueue;
  //Configuration variables
  private readonly STREAK: number;

  constructor(
    name: string,
    id: string,
    socket: any,
    private configService: ConfigService,
  ) {
    this.name = name;
    this.queue = [];
    this.streak = 0;
    this.isAlive = true;
    this.isReady = false;
    this.nbBadAnswers = 0;
    this.nbGoodAnswers = 0;
    this.id = id;
    this.rank = 0;
    this.currentSocket = socket;
    this.lastWrongAnswerTime = 0;
    this.configService = configService;

    this.STREAK = parseInt(this.configService.get<string>("STREAK"));
  }

  /**
   * Return the player's id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Set a new time for the last time the player answered wrongly
   */
  public updateWrongAnswerTime() {
    this.lastWrongAnswerTime = Date.now();
  }

  /**
   * Return the last time the player answered wrongly to the question
   */
  public getWrongAnswerTime() {
    return this.lastWrongAnswerTime;
  }

  /**
   * Return the 1st question in the question queue
   */
  public getCurrentQuestion() {
    return this.currentQuestion;
  }

  /**
   * Replace the current question by the next one in the queue
   */
  public nextQuestion(): QuestionInQueue | void {
    if (this.queue.length > 0) {
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
   * Unalives the player
   */
  public unalive(rank: number) {
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
   */
  public getStreak() {
    return this.streak;
  }

  /**
   * Add a new question to the question queue
   * @param question the question to add
   */
  public addQuestion(question: any) {
    if (this.currentQuestion == undefined) {
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
    return {
      streak: this.streak,
      canAttack: this.streak >= this.STREAK,
      isAlive: this.isAlive,
      nbBadAnswers: this.nbBadAnswers,
      nbGoodAnswers: this.nbGoodAnswers,
      rank: this.rank,
      questions: this.queue,
    };
  }

  /**
   * Move to the next question, increase the good answer counter and the streak
   */
  public correctAnswer(): void {
    this.nextQuestion();
    this.addGoodAnswer();
    this.incrementStreak();
  }

  /**
   * Increases the bad answer counter and resets the streak
   */
  public badAnswer(): void {
    this.addBadAnswer();
    this.resetStreak();
  }

  /**
   * Change the socket linked to the player
   * @param socket to change to
   */
  public changeSocket(socket: any) {
    this.currentSocket = socket;
  }

  /**
   * Get the current socket of the player
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
   */
  public getScore() {
    return this.nbGoodAnswers;
  }

  /**
   * Return the state of the player
   */
  public alive() {
    return this.isAlive;
  }

  /**
   * Return the number of rightly answered questions
   */
  public getGoodAnswers(): number {
    return this.nbGoodAnswers;
  }

  /**
   * Returns the amount of bad answers given by the player
   */
  public getBadAnswers(): number {
    return this.nbBadAnswers;
  }

  /**
   * Increments the amount of bad answers by one
   */
  public addBadAnswer(): void {
    this.nbBadAnswers++;
  }

  /**
   * Increments the amount of good answers by one
   */
  public addGoodAnswer(): void {
    this.nbGoodAnswers++;
  }
}
