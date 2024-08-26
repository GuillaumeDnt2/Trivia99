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
        
        this.fetchQuestions(Q_FETCH_SIZE);
    }
    public check(q:QuestionInQueue, answer:number){
        if(!this.questionPool.has(q.id)){
            throw new Error('Question is not yet present in the game');
        }
        let question = this.questionPool.get(q.id);
        return question.correctAnsw == answer;
    }

    public get(q:QuestionInQueue){
        return new QuestionToSend(this.questionPool.get(q.id), q.isAttack);
    }

    public newQuestion(isAttack:boolean){
        let question: Question;
        
        do{
            if (this.questionList.size <= QUESTION_MIN){
                this.fetchQuestions(Q_FETCH_SIZE);
            }
            question = this.questionList.get();
        }while(this.questionPool.has(question.id))
        
        this.questionPool.set(question.id, question);
  
        return new QuestionInQueue(question,isAttack);

    }

    private fetchQuestions(limit: number) {
        const fs = require('fs');
        let questions: any[] = [];

        try {
            const data = fs.readFileSync('../../json/questions.json', 'utf-8');
            questions = JSON.parse(data);

            // Limit the number of questions if necessary
            questions = questions.slice(0, limit);

            // Print the questions
            questions.forEach((question: any) => {
                this.questionList.add(new Question(question));
            });

        } catch (err) {
            console.error('Error reading or parsing questions:', err);
        }
    }
}