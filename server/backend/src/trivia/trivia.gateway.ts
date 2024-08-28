import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";

import { Server } from "socket.io";
import { OnModuleInit } from "@nestjs/common";
import { Game } from "./game";
import {ConfigService} from "@nestjs/config";
import { parse } from 'cookie';

const cors =
  process.env.CORS_URL != undefined
    ? process.env.CORS_URL
    : "http://localhost:3000";

@WebSocketGateway({
  cors: {
    origin: cors,
  },
})

export class TriviaGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  game: Game;
  private STREAK: number;
  constructor(private configService: ConfigService) {
    this.STREAK = parseInt(this.configService.get<string>("STREAK"));
  }
  onModuleInit() {
    //Create a new game if it doesn't exist
    if (this.game == undefined) {
      this.game = new Game(this.server, this.configService);
    }

    this.server.on("connection", (socket) => {
      console.log(socket.id);
      console.log("Connected");

      socket.on("disconnect", () => {
        console.log(socket.id);
        console.log("Disconnected");
        if (this.game.getPlayers().has(socket.id)) {
          if (this.game.getPlayers().get(socket.id).isReady) {
            --this.game.nbReady;
          }
          this.game.getPlayers().delete(socket.id);
        }
      });
    });
  }

  sendReadyInfo() {
    this.server.emit("playersConnected", {
      nbReady: this.game.getNbReady(),
      nbPlayers: this.game.getNbPlayers(),
    });
  }

  getIdFromCookieGatheredFromTheSocket(socket: any): string | null {
    const cookie = socket.handshake.headers.cookie;

    if(!cookie){
      return null;
    }

    const parsedCookie = parse(cookie);

    return parsedCookie['userId'] || null;
  }

  @SubscribeMessage("isUserLogged")
  onIsUserLogged(@ConnectedSocket() socket: any){
    let loggedInInfo = this.game.getPlayers().has(this.getIdFromCookieGatheredFromTheSocket(socket));
    this.server.to(socket.id).emit("loggedInfo",
        {
          loggedInInfo
        })
  }

  @SubscribeMessage("login")
  onLogin(@MessageBody() name: any, @ConnectedSocket() socket: any) {
    this.game.addPlayer(socket.id, name);
    //socket.send("Number of ready users: " + this.game.getNbReady()); //Placeholder
    this.sendReadyInfo();
  }



  @SubscribeMessage("ready")
  onReady(@ConnectedSocket() socket: any) {
    if (
      this.game.getPlayers().has(socket.id) &&
      !this.game.getPlayers().get(socket.id).isReady
    ) {
      this.game.getPlayers().get(socket.id).isReady = true;
      ++this.game.nbReady;
      this.sendReadyInfo();
      this.game.checkAndStartGame();
    }
  }

  @SubscribeMessage("unready")
  onUnready(@ConnectedSocket() socket: any) {
    if (
      this.game.getPlayers().has(socket.id) &&
      this.game.getPlayers().get(socket.id).isReady
    ) {
      this.game.getPlayers().get(socket.id).isReady = false;
      --this.game.nbReady;
      this.sendReadyInfo();
    }
  }

  /**
   * Will send a question to everyone
   * @param socket
   */
  @SubscribeMessage("question")
  onQuestion(@ConnectedSocket() socket: any) {
    this.server.emit("onQuestion", {
      //Send the question to everyone
      msg: "Question",
    });
  }

  /**
   * Attack another player randomly
   * @param socket
   */
  @SubscribeMessage("attack")
  onAttack(@ConnectedSocket() socket: any) {
    //Get the streak of the player to determine how many attacks are sent
    const streak = this.game.getPlayerById(socket.id).getStreak();
    //If the streak is less than 3, don't send any attacks
    if (streak < this.STREAK) return;

    const connectedSockets = Array.from(this.server.sockets.sockets.values());
    const otherSockets = connectedSockets.filter((s) => s.id !== socket.id);

    if (otherSockets.length > 0) {
      //Send the attack to the other players
      for (let i = 0; i < streak - this.STREAK; i++) {
        const randomSocket =
          otherSockets[Math.floor(Math.random() * otherSockets.length)];
        this.game.addAttackQuestionToPlayer(randomSocket.id);
      }
    }
    //Then reset the streak
    this.game.getPlayerById(socket.id).resetStreak();
  }

  /**
   * Sends the answer of the question to the server and checks if the answer is valid or not
   * @param body The answer of the question
   * @param socket The socket of the user that answered the question
   */
  @SubscribeMessage("answer")
  onAnswer(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    //Get the player that answered the question
    const player = this.game.getPlayers().get(socket.id);
    //Check if the answer is correct
    const question = player.getCurrentQuestion();
    //Todo: Logic of the answer handling, can only do it once the question class is done
    //If the answer is correct
    socket.emit("onResult", {
      msg: "Correct",
    });
    //If the answer is incorrect
    socket.emit("onResult", {
      msg: "Incorrect",
    });
  }

  @SubscribeMessage("deathUpdate")
  onDeathUpdate(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    //Get the player that died
    const player = this.game.getPlayerById(socket.id);
    player.kill();
    //Tell everyone that the player died
    this.server.emit("onDeath", {
      msg: "Player died",
      id: socket.id,
    });
  }

  @SubscribeMessage("getStreak")
  getStreak(@ConnectedSocket() socket: any) {
    //Get the player that asked for the streak
    const player = this.game.getPlayerById(socket.id);
    socket.emit("streak", {
      streak: player.getStreak(),
    });
  }
}
