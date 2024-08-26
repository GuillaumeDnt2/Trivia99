import { Question } from './question';
import { QuestionToSend } from './questionToSend';
import { QuestionInQueue } from './questionInQueue';
import { Queue } from './queue';
const QUESTION_MIN = 3;
const Q_FETCH_SIZE = 50;
export class QuestionManager {
    
    private questionPool: Map<string,Question>;
    private questionList: Queue;

    constructor(){
        this.questionPool = new Map<string,Question>;
        this.questionList = new Queue();
        let q = new Question();
        this.fetchQuestions(Q_FETCH_SIZE);
    }

    public get(id:string){
        return this.questionPool.get(id);
    }

    public newQuestion(){
        let question: Question;
        q_InQueue: QuestionInQueue;
        if (this.questionList.size <= QUESTION_MIN){
            this.fetchQuestions(Q_FETCH_SIZE);
        }
        question = this.questionList.get();
        return new QuestionInQueue(question);

    }

    private fetchQuestions(limit:number){


        var fs = require('fs');
        let questions : any;
        let n = 0;
        fs.readFile('../../json/questions.json', 'utf-8', function (err, data) {
            if (err) throw err;
            n++;
            questions = JSON.parse(data);
            console.log(n);
            
            
        });
        console.log(n);
        /*for(var q in questions ){
            console.log(q);
        }*/
        
    }
}