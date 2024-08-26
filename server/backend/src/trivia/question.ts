function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }


export class Question {
    
    id: string;
    category: string;
    answers: string[];
    correctAnsw: number;  
    question: string;
    difficulty: string;

    constructor(data:any){
   
        this.answers = [];
        this.id = data.id;
        this.category = data.category;
        this.question = data.question;
        this.difficulty = data.difficulty;
        this.correctAnsw = Math.floor(Math.random() * 4);
        for(var n = 0; n < 3; n++){
            if(n == this.correctAnsw)
                this.answers.push(data.correctAnswer);
            this.answers.push(data.incorrectAnswers[n]);
        }
        if(this.answers.length < 4){
            this.answers.push(data.correctAnswer);
        }
        

       
    }
}