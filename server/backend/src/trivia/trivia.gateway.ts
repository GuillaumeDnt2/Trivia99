import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
} from "@nestjs/websockets";

import {Server} from "socket.io";
import {OnModuleInit} from "@nestjs/common";
import {Game} from "./game";

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

            socket.on("disconnect", () => {
                console.log(socket.id);
                console.log("Disconnected");
                if (game.getPlayers().has(socket.id)) {
                    if(game.getPlayers().get(socket.id).isReady) {
                        --game.nbReady;
                    }
                    game.getPlayers().delete(socket.id);
                }
            });
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
        if(game.getPlayers().has(socket.id) && !game.getPlayers().get(socket.id).isReady) {
            game.getPlayers().get(socket.id).isReady = true;
        }
        ++game.nbReady;
        this.server.emit("onReady", {
            msg: "Ready"
        });
    }

    @SubscribeMessage("unready")
    onUnready(@MessageBody() body: any, @ConnectedSocket() socket: any) {
        if(game.getPlayers().has(socket.id) && !game.getPlayers().get(socket.id).isReady) {
            game.getPlayers().get(socket.id).isReady = false;
        }
        --game.nbReady;
        this.server.emit("onUnready", {
            msg: "Unready"
        });
    }

    @SubscribeMessage("start")
    onStart(@MessageBody() body: any, @ConnectedSocket() socket: any) {
        this.server.emit("onStart", {
            msg: "Start"
        });
    }

    @SubscribeMessage("amountReady")
    onAmountReady(@MessageBody() body: any, @ConnectedSocket() socket: any) {
        this.server.emit("onAmountReady", {
            msg: game.getNbReady()
        });
    }

    /**
     * Will send a question to everyone
     * @param socket
     */
    @SubscribeMessage("question")
    onQuestion(@ConnectedSocket() socket: any) {
        this.server.emit("onQuestion", {
            //Send the question to everyone
            msg: "Question"
        });
    }

    /**
     * Attack another player randomly
     * @param socket
     */
    @SubscribeMessage("attack")
    onAttack(@ConnectedSocket() socket: any) {
      const connectedSockets = Array.from(this.server.sockets.sockets.values());
      const otherSockets = connectedSockets.filter(s => s.id !== socket.id);

      if (otherSockets.length > 0) {
        const randomSocket = otherSockets[Math.floor(Math.random() * otherSockets.length)];
        randomSocket.emit("onAttack", {
          //Send the question t
          msg: "AttackQuestion!!" //Todo: Send a question from the attack question list
        });
      }
    }

    /**
     * Sends the answer of the question to the server and checks if the answer is valid or not
     * @param body The answer of the question
     * @param socket The socket of the user that answered the question
     */
    @SubscribeMessage("answer")
    onAnswer(@MessageBody() body: any, @ConnectedSocket() socket: any) {
        //Get the player that answered the question
        const player = game.getPlayers().get(socket.id);
        //Check if the answer is correct
        const question = player.getCurrentQuestion();
        //Todo: Logic of the answer handling, can only do it once the question class is done
        //If the answer is correct
        socket.emit("onResult", {
            msg: "Correct"
        });
        //If the answer is incorrect
        socket.emit("onResult", {
            msg: "Incorrect"
        });
    }

    @SubscribeMessage("deathUpdate")
    onDeathUpdate(@MessageBody() body: any, @ConnectedSocket() socket: any) {
        //Get the player that died
        const player = game.getPlayers().get(socket.id);
        player.kill();
        //Tell everyone that the player died
        this.server.emit("onDeath", {
            msg: "Player died",
            id: socket.id
    });
    }
}
