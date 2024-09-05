import { Question } from "./question";

/**
 * This class represents a question with only its id and difficulty, used in the frontend to display the question queue.
 * @class QuestionInQueue
 * @Authors : Neroil, Tasticoco, VBonzon et GuillaumeDnt2
 */
export class QuestionInQueue {
  private readonly id: string;
  private readonly difficulty: any;
  private readonly isAttack: boolean;

  constructor(q: Question, attack: boolean) {
    this.id = q.getId();
    this.difficulty = q.getDifficulty();
    this.isAttack = attack;
  }

  /**
   * Id getter
   * Returns the question's id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Difficulty getter
   * Returns the question's difficulty
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
