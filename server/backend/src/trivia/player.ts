import { QuestionInQueue } from "./questionInQueue";

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

  constructor(name: string, id:string) {
    this.name = name;
    this.queue = [];
    this.streak = 0;
    this.isAlive = true;
    this.isReady = false;
    this.nbBadAnswers = 0;
    this.nbGoodAnswers = 0;
    this.nbAnsweredQuestions = 0;
    this.id = id;
  }

  /**
   * 
   * @returns Player id
   */
  public getId() : string{
    return this.id;
  }

  /**
   * Return the 1st question in the question queue
   * @returns 
   */
  public getCurrentQuestion() {
    if (this.queue.length > 0) {
      return this.queue[0];
    }
  }

  /**
   * Return the nb of question in the question queue
   * @returns 
   */
  public getNbQuestions() {
    return this.queue.length;
  }

  /**
   * Unalive the player
   */
  public kill() {
    this.isAlive = false;
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
    this.queue.push(question);
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
      isAlive: this.isAlive,
      nbBadAnswers: this.nbBadAnswers,
      nbGoodAnswers: this.nbGoodAnswers,
      questions: [],
    };
    this.queue.forEach((question: any) => {
      info.questions.push(question);
    });

    return info;
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
    this.nbAnsweredQuestions ++;
  }
  public addBadAnswer() : void {
    this.nbBadAnswers++;
  }

  public addGoodAnswer() : void {
    this.nbGoodAnswers++;
  }
}
