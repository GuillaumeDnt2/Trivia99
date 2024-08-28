import { QuestionInQueue } from "./questionInQueue";

export class Player {
  private name: string;
  private queue: QuestionInQueue[];
  private streak: number;
  private isAlive: boolean;
  public isReady: boolean;
  public nbBadAnswers: number;
  public nbGoodAnswers: number;
  public nbAnsweredQuestions: number;
  private socket: string;

  constructor(name: string, socket:string) {
    this.name = name;
    this.queue = [];
    this.streak = 0;
    this.isAlive = true;
    this.isReady = false;
    this.nbBadAnswers = 0;
    this.nbGoodAnswers = 0;
    this.nbAnsweredQuestions = 0;
    this.socket = socket;
  }

  public getSocket(){
    return this.socket;
  }

  public getCurrentQuestion() {
    if (this.queue.length > 0) {
      return this.queue[0];
    }
  }

  public getNbQuestions() {
    return this.queue.length;
  }

  public kill() {
    this.isAlive = false;
  }

  public resetStreak() {
    this.streak = 0;
  }

  public incrementStreak() {
    ++this.streak;
  }

  public getStreak() {
    return this.streak;
  }

  public addQuestion(question: any) {
    this.queue.push(question);
  }

  public removeQuestion() {
    this.queue.shift();
  }

  public getUserInfo(): object {
    let info = {
      streak: this.streak,
      isAlive: this.isAlive,
      nbBadAnswers: this.nbBadAnswers,
      nbGoodAnswers: this.nbGoodAnswers,
      nbAnsweredQuestions: this.nbAnsweredQuestions,
      questions: [],
    };
    this.queue.forEach((question: any) => {
      info.questions.push(question);
    });

    return info;
  }

  public getName() {
    return this.name;
  }

  public getScore() {
    return this.nbGoodAnswers;
  }

  getAlive() {
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
