export class Question {

  private id: string;
  private category: string;
  private answers: string[];
  private correctAnsw: number;
  private question: string;
  private difficulty: string;

  constructor(data: any) {
    this.answers = [];
    this.id = data.id;
    this.category = data.category;
    this.question = data.question;
    this.difficulty = data.difficulty;

    //Choose a random position to insert the correct answer among the incorrect ones
    this.correctAnsw = Math.floor(Math.random() * 4);
    for (var n = 0; n < 3; n++) {
      if (n == this.correctAnsw) 
        this.answers.push(data.correctAnswer);
      this.answers.push(data.incorrectAnswers[n]);
    }
    if (this.answers.length < 4) {
      this.answers.push(data.correctAnswer);
    }

    //console.log(this);
  }

  /**
   * Id getter
   * @returns question's id
   */
  public getId() : string{
    return this.id;
  }

  /**
   * Difficulty getter
   * @returns question's difficulty
   */
  public getDifficulty() : string{
    return this.difficulty;
  }

  /**
   * Category getter
   * @returns question's category
   */
  public getCategory() : string{
    return this.category;
  }

  /**
   * Answers getter
   * @returns question's answers
   */
  public getAnswers() : string[]{
    return this.answers;
  }

  /**
   * Correct answer getter
   * @returns question's correct answer
   */
  public getCorrectAnswer() : number{
    return this.correctAnsw;
  }

  /**
   * Question getter
   * @returns question's question
   */
  public getQuestion() : string{
    return this.question;
  }



}
