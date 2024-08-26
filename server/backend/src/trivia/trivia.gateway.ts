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
const cors =
  process.env.CORS_URL != undefined ? process.env.CORS_URL : "http://localhost:3000";


const game = new Game();

@WebSocketGateway({
  cors: {
    origin: cors,
  },
})

export class TriviaGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on("connection", (socket) => {
      console.log(socket.id);
      console.log("Connected");
    });
  }

  @SubscribeMessage("message")
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit("onMessage", {
      msg: "New Message",
      content: body,
    });
  }

  @SubscribeMessage("login")
  onLogin(@MessageBody() name: any, @ConnectedSocket() socket: any) {
    game.addPlayer(socket.id, name);
    socket.send("Number of ready users: " + game.getNbReady()); //Placeholder
  }

  @SubscribeMessage("ready")
  onReady(@MessageBody() body: any, @ConnectedSocket() socket: any) {
      game.getPlayers().get(socket.id).isReady = true;
      this.server.emit("onReady", {
          msg: "Ready"
      });
  } 

  @SubscribeMessage("unready")
    onUnready(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    game.getPlayers().get(socket.id).isReady = false;
        this.server.emit("onUnready", {
            msg: "Unready"
        });
    }

}
