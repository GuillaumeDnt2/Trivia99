import { Question } from "./question";

export class QuestionInQueue {
  id: string;
  difficulty;
  isAttack: boolean;

  constructor(q: Question, attack: boolean) {
    this.id = q.id;
    this.difficulty = q.difficulty;
    this.isAttack = attack;
  }
}
