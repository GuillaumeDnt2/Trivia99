import { QuestionInQueue } from "./questionInQueue";
import { Question } from "./question";

/**
 * The question to be sent to the player without the good answer being highlighted.
 * @class QuestionToSend
 * @Authors : Neroil, Tasticoco, VBonzon et GuillaumeDnt2
 */
export class QuestionToSend extends QuestionInQueue {
  private readonly category: string;
  private readonly answers: string[];
  private readonly question: string;

  constructor(q: Question, attack: boolean) {
    super(q, attack);
    this.category = q.getCategory();
    this.answers = q.getAnswers();
    this.question = q.getQuestion();
  }

  /**
   * Category getter
   * @returns question's category
   */
  public getCategory(): string {
    return this.category;
  }

  /**
   * Answers getter
   * @returns question's answers
   */
  public getAnswers(): string[] {
    return this.answers;
  }

  /**
   * Question getter
   * @returns question's question
   */
  public getQuestion(): string {
    return this.question;
  }
}
