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
                console.log(question);
            });

        } catch (err) {
            console.error('Error reading or parsing questions:', err);
        }
    }
}