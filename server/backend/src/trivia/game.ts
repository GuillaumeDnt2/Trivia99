import { Player } from './player';
import { QuestionManager} from './questionManager';
import { QuestionToSend } from './questionToSend';

export class Game{
    public nbReady: number;
    private players: Map<string,Player>;
    private qManager: QuestionManager;
    constructor() {
        this.nbReady = 0;
        this.players = new Map<string,Player>();
        this.qManager = new QuestionManager();
        let qiq = this.qManager.newQuestion(false);
        //console.log(qiq);
        let qq = this.qManager.get(qiq);
        console.log("Question to send: ");
        console.log(qq);
        console.log(this.qManager.check(qiq, 1));  
    }

    public addPlayer(id: string, name: string) {   
        this.players.set(id, new Player(name));
    }

    public getPlayers() {
        return this.players;
    }

    public getNbPlayers() {
        return this.players.size;
    }

    public getNbReady() {
        return this.nbReady;
    }
}