export class Player {
    private name: string;
    private queue: [];
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

}