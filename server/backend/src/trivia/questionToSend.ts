import { QuestionInQueue } from "./questionInQueue";
import { Question } from "./question";
export class QuestionToSend extends QuestionInQueue {
  private category: string;
  private answers: string[];
  private question: string;

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
