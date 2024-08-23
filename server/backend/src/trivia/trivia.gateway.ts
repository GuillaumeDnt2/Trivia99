import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";
import { OnModuleInit } from "@nestjs/common";
const cors =
  process.env.CORS_URL != undefined ? process.env.CORS_URL : "http://localhost:3000";
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
}
