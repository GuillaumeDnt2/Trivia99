import { Player } from './player';
import { QuestionManager} from './questionManager';
import {Server} from "socket.io";
import { QuestionToSend } from './questionToSend';

export class Game{
    public nbReady: number;
    private players: Map<string,Player>;
    private hasStarted: boolean;
    private qManager: QuestionManager;
    private server: Server;

    constructor(server: any) {
        this.nbReady = 0;
        this.players = new Map<string,Player>();
        this.qManager = new QuestionManager();
        this.hasStarted = false;
        this.server = server;
        let qiq = this.qManager.newQuestion(false);
        //console.log(qiq);
        let qq = this.qManager.get(qiq);
        console.log("Question to send: ");
        console.log(qq);
        console.log(this.qManager.check(qiq, 1)); 
    }

    public checkAndStartGame() {
        if (this.getNbReady() >= 2 && this.getNbReady() >= this.players.size*0.8){
            this.startGame();
        }
         
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

    public startGame() {
        this.hasStarted = true;
        this.server.emit("startGame", {
            msg: "The game has started"
        });

        this.sendTimedQuestionToEveryone().then(r => {
            console.log("Questions sent");
        });
    }

    public async sendTimedQuestionToEveryone() {

        // Send the question to everyone every 10 seconds
        setInterval(() => {
            let question = this.qManager.newQuestion(false);
            this.players.forEach((player: Player, id: string) => {
                player.addQuestion(question);
                let info = player.getUserInfo();
                this.server.to(id).emit("userInfo", {
                    info: info
                });
            });
        }, 10000);
    }

    public getPlayerById(id: string) {
        return this.players.get(id);
    }


}