import { Question } from "./question";

export class QuestionInQueue {
  private id: string;
  private difficulty;
  private isAttack: boolean;

  constructor(q: Question, attack: boolean) {
    this.id = q.getId();
    this.difficulty = q.getDifficulty();
    this.isAttack = attack;
  }

  /**
   * Id getter
   * @returns question's id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Difficulty getter
   * @returns question's difficulty
   */
  public getDifficulty(): string {
    return this.difficulty;
  }

  /**
   * Return if the question is from an attack
   */
  public getIsAttack(): boolean {
    return this.isAttack;
  }
}
