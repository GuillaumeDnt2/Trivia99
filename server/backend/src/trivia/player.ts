import { QuestionInQueue } from "./questionInQueue";

export class Player {
  private name: string;
  private queue: QuestionInQueue[];
  private streak: number;
  private isAlive: boolean;
  public isReady: boolean;
  private nbBadAnswers: number;
  private nbGoodAnswers: number;

  constructor(name: string) {
    this.name = name;
    this.queue = [];
    this.streak = 0;
    this.isAlive = true;
    this.isReady = false;
    this.nbBadAnswers = 0;
    this.nbGoodAnswers = 0;
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
}
