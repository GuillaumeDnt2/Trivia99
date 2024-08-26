export class Player {
    private name: string;
    private queue: any[];
    private streak: number;
    private isAlive: boolean;
    public isReady: boolean;
    private nbBadAnswers: number;
    private nbGoodAnswers: number;

    constructor(name: string) {
        this.name = name;
        this.queue = [];
        this.streak = 0;
        this.isAlive = true;
        this.isReady = false;
        this.nbBadAnswers = 0;
        this.nbGoodAnswers = 0;
    }

    public getCurrentQuestion() {
        if(this.queue.length > 0) {
            return this.queue[0];
        }
    }

    public kill() {
        this.isAlive = false;
    }

}