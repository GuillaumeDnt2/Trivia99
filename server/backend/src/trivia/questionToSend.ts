import { QuestionInQueue } from "./questionInQueue";
import { Question } from "./question";
export class QuestionToSend extends QuestionInQueue {

    category:string;
    answers:string[];
    question:string;

    constructor(q:Question, attack:boolean){
        super(q,attack);
        this.category = q.category;
        this.answers = q.answers;
        this.question = q.question;
    
    }
}