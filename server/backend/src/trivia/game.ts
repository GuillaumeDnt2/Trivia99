import { Player } from './player';

export class Game{
    public nbReady: number;
    private players: Map<string,Player>;

    constructor() {
        this.nbReady = 0;
        this.players = new Map<string,Player>();
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