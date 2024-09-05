/**
 * This class represents a question
 * @class Question
 * @Authors : Neroil, Tasticoco, VBonzon et GuillaumeDnt2
 */
export class Question {
  private readonly id: string;
  private readonly category: string;
  private readonly answers: string[];
  private readonly correctAnsw: number;
  private readonly question: string;
  private readonly difficulty: string;

  constructor(data: any) {
    this.answers = [];
    this.id = data.id;
    this.category = data.category;
    this.question = data.question;
    this.difficulty = data.difficulty;

    //Choose a random position to insert the correct answer among the incorrect ones
    this.correctAnsw = Math.floor(Math.random() * 4);
    for (var n = 0; n < 3; n++) {
      if (n == this.correctAnsw) this.answers.push(data.correctAnswer);
      this.answers.push(data.incorrectAnswers[n]);
    }
    if (this.answers.length < 4) {
      this.answers.push(data.correctAnswer);
    }
  }

  /**
   * Id getter
   * Returns question's id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Difficulty getter
   * Returns question's difficulty
   */
  public getDifficulty(): string {
    return this.difficulty;
  }

  /**
   * Category getter
   * Returns question's category
   */
  public getCategory(): string {
    return this.category;
  }

  /**
   * Answers getter
   * Returns question's answers
   */
  public getAnswers(): string[] {
    return this.answers;
  }

  /**
   * Correct answer getter
   * Returns question's correct answer
   */
  public getCorrectAnswer(): number {
    return this.correctAnsw;
  }

  /**
   * Question getter
   * Returns question's question
   */
  public getQuestion(): string {
    return this.question;
  }
}
