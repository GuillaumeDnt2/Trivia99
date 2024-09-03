import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { OnModuleInit } from "@nestjs/common";
import { GameManager} from "./gameManager";
import {ConfigService} from "@nestjs/config";
import { parse, serialize } from 'cookie';

// CORS configuration
const cors =
  process.env.CORS_URL != undefined
    ? process.env.CORS_URL
    : "http://localhost:3000";


/**
 * @class TriviaGateway
 * @description This class is responsible for handling WebSocket connections and events for trivia99.
 */
@WebSocketGateway({
  cors: {
    origin: cors,
  },
})
export class TriviaGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  gameManager: GameManager;
  private STREAK: number;
  private WRONG_ANSWER_COOLDOWN: number;

  /**
   * @constructor
   * @param {ConfigService} configService - The service to access the application configuration.
   */
  constructor(public configService: ConfigService) {
    this.STREAK = parseInt(this.configService.get<string>("STREAK"));
    this.WRONG_ANSWER_COOLDOWN = parseInt(this.configService.get<string>("WRONG_ANSWER_COOLDOWN"));
  }

  /**
   * @method onModuleInit
   * @description Lifecycle hook that is called when the application starts.
   */
  onModuleInit(): void {
    //Create a new game if it doesn't exist
    if (this.gameManager == undefined) {
      this.gameManager = new GameManager(this.server, this.configService);
    }

    /**
     * @event connection
     * @description Event listener for the 'connection' event. This event is emitted when a new client connects to the server.
     */
    this.server.on("connection", (socket) => {
      //console.log(socket.id);
      //console.log("Connected");

      let userId = this.getIdFromHeaders(socket);

      //If the user doesn't have a cookie, generate one
      if (!userId) {
        this.generateAndSetCookie(socket);
      } else {
        //We need to check if the user is already in the game or not
        if(this.gameManager.game.getPlayers().has(userId)){
          //Clearing the timeout if the user is already in the game
          clearTimeout(this.gameManager.game.getPlayers().get(userId).isInTimeOut);
          //Changing the socket of the player
          this.gameManager.game.getPlayers().get(userId).changeSocket(socket);
        }
      }

      /**
       * @event disconnect
       * @description Event listener for the 'disconnect' event. This event is emitted when a client disconnects from the server.
       */
      socket.on("disconnect", () => {
        //console.log(socket.id);
        //console.log("Disconnected");

        let userId = this.getIdFromHeaders(socket);

        //If the user is in the game, set a timeout to remove him from the game after a certain time
        if (this.gameManager.game.getPlayers().has(userId)){
          this.gameManager.game.getPlayers().get(userId).isInTimeOut = setTimeout(() => {
            //console.log("User timed out");
            if (this.gameManager.game.getPlayers().has(userId)) {
              if (this.gameManager.game.getPlayers().get(userId).isReady) {
                --this.gameManager.game.nbReady;
              }
              this.gameManager.game.getPlayers().delete(userId);
            }
          }, 5000);
        }
      });
    });
  }

  /**
   * @method generateAndSetCookie
   * @description Generates a user ID and sets it as a cookie for the client.
   * @param {Socket} socket - The socket object of the client.
   * @returns {string} The generated user ID.
   */
  private generateAndSetCookie(socket: Socket): string {
    const userId = socket.id;
    const cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: 'strict' as const,
      path: '/',
    };

    const serializedCookie = serialize('userId', userId, cookieOptions);

    socket.emit('setCookie', serializedCookie);

    return userId;
  }

  /**
   * @method sendReadyInfo
   * @description Emits an event to all clients with the number of ready and total players.
   */
  sendReadyInfo(): void {
    this.server.emit("playersConnected", {
      nbReady: this.gameManager.game.getNbReady(),
      nbPlayers: this.gameManager.game.getNbPlayers(),
    });
  }

  /**
   * @method getIdFromHeaders
   * @description Retrieves the user ID from the handshake headers.
   * @param {any} socket - The socket object of the client.
   * @returns {string | null} The user ID, or null if no user ID was found.
   */
  getIdFromHeaders(socket: any): string | null {
    const cookie = socket.handshake.headers.authorization;

    if(!cookie){
      console.log("No cookie found");
      return null;
    }

    const parsedCookie = parse(cookie);

    return parsedCookie['userId'] || null;
  }

  /**
   * @method onIsUserLogged
   * @description Checks if the user is logged in, aka ready to play or already playing.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("isUserLogged")
  onIsUserLogged(@ConnectedSocket() socket: any){
    let loggedInfo = this.gameManager.game.getPlayers().has(this.getIdFromHeaders(socket));
    this.server.to(socket.id).emit("loggedInfo",loggedInfo);
  }

  /**
   * @method onLogin
   * @description Logs in a user.
   * @param {string} name - The name of the user.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("login")
  onLogin(@MessageBody() name: string, @ConnectedSocket() socket: any) {
    //Doesn't re-add the player if he's already in the game
    if(!this.gameManager.game.getPlayers().has(this.getIdFromHeaders(socket))) {
      let player = this.gameManager.game.addPlayer(this.getIdFromHeaders(socket), name, socket);
      
      this.sendReadyInfo();
    }
  }

  /**
   * @method onReady
   * @description Marks a user as ready.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("ready")
  onReady(@ConnectedSocket() socket: any) {
    const playerId = this.getIdFromHeaders(socket);
    if (
        this.gameManager.game.getPlayers().has(playerId) &&
        !this.gameManager.game.getPlayers().get(playerId).isReady
    ) {
      this.gameManager.game.getPlayers().get(playerId).isReady = true;
      ++this.gameManager.game.nbReady;
    }
    this.sendReadyInfo();
    this.gameManager.game.checkAndStartGame();

  }

    /**
     * @method onUnready
     * @description Marks a user as unready.
     * @param {Socket} socket - The socket object of the client
     */
  @SubscribeMessage("unready")
  onUnready(@ConnectedSocket() socket: any) {
    const playerId = this.getIdFromHeaders(socket);
    if (
      this.gameManager.game.getPlayers().has(playerId) &&
      this.gameManager.game.getPlayers().get(playerId).isReady
    ) {
      this.gameManager.game.getPlayers().get(playerId).isReady = false;
      --this.gameManager.game.nbReady;
      this.sendReadyInfo();
    }
  }

  /**
   * @method onQuestion
   * @description Sends a question to all users.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("question")
  onQuestion(@ConnectedSocket() socket: any) {
    this.server.emit("onQuestion", {
      //Send the question to everyone
      msg: "Question",
    });
  }

  /**
   * @method onAttack
   * @description Attacks another player randomly.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("attack")
  onAttack(@ConnectedSocket() socket: any) {
    //Get the streak of the player to determine how many attacks are sent
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket));
    const streak = player.getStreak();
    //If the streak is less than 3, don't send any attacks
    if (streak < this.STREAK) return;

    if (this.gameManager.game.getNbPlayerAlive() > 1) {
      //Send the attack to the other players
      const qSent = streak-this.STREAK;
      this.gameManager.game.sendFeedUpdate(player.getName() + " attacked with " + qSent + " question(s)");
      for (let i = 0; i <= qSent; i++) {
        console.log(player.getName() + " has attacked !");
        this.gameManager.game.attackPlayer(player);
      }
      
    }
    //Then reset the streak
    this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket)).resetStreak();
    socket.emit("userInfo", player.getUserInfo());
  }

  @SubscribeMessage("getAllInfo")
  onGetAllInfo(@ConnectedSocket() socket:any){
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket))
    if(player){
      socket.emit("userInfo", player.getUserInfo());
      this.gameManager.game.emitCurrentQuestionOf(player);
      socket.emit("players", this.gameManager.game.getAllPlayerList());
    }
  }

  /**
   * @method onAnswer
   * @description Handles the answer of a user.
   * @param {any} body - The body of the message.
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("answer")
  onAnswer(@MessageBody() body: any, @ConnectedSocket() socket: any) {

    if(!this.gameManager.game.hasGameStarted()){
        return;
    }

    const player = this.gameManager.game.getPlayers().get(this.getIdFromHeaders(socket));

    if(player){
      //Check if the player still has a cooldown for wrong answers
      if(Date.now() - player.getWrongAnswerTime() < this.WRONG_ANSWER_COOLDOWN * 1000){
        socket.emit("onCooldown", {
          timeRemainingMs: this.WRONG_ANSWER_COOLDOWN - (Date.now() - player.getWrongAnswerTime())
        })
        return;
      }
      //Check if the answer is correct
      if(this.gameManager.game.checkPlayerAnswer(player, body)){
        //Send correct answer msg
        socket.emit("goodAnswer");
      }
      else{
        //If the answer is incorrect
        player.updateWrongAnswerTime();
        socket.emit("badAnswer");
      }
    }
  }

    /**
     * @method onDeathUpdate
     * @description Handles the death of a user.
     * @param {any} body - The body of the message.
     * @param {Socket} socket - The socket object of the client.
     */
  @SubscribeMessage("deathUpdate") //TO CHANGE
  onDeathUpdate(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    //Get the player that died
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket));
    //player.unalive(); ???
    //Tell everyone that the player died
    this.server.emit("onDeath", this.getIdFromHeaders(socket));
  }

  /**
   * @method getReadyInfo
   * @description Sends the ready info to everyone when requested
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("getReadyInfo")
  getReadyInfo(@ConnectedSocket() socket: any) {
    this.sendReadyInfo();
  }

  /**
   * @method getStreak
   * @description Sends the streak of a player when requested
   * @param {Socket} socket - The socket object of the client.
   */
  @SubscribeMessage("getStreak")
  getStreak(@ConnectedSocket() socket: any) {
    //Get the player that asked for the streak
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket));
    socket.emit("streak", {
      streak: player.getStreak(),
    });
  }

  @SubscribeMessage("isStarted")
  getGameStatus(@ConnectedSocket() socket: any) {
    let status = this.gameManager.game.hasGameStarted();
    socket.emit("startStatus", {
      status
    });
  }

  @SubscribeMessage("getRanking")
  getRanking(@ConnectedSocket() socket: any){
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket));
    if(player){
      this.gameManager.game.emitLeaderboardToPlayer(player);
    }
  }

  @SubscribeMessage("deleteUser")
  deleteUser(@ConnectedSocket() socket: any){
    const player = this.gameManager.game.getPlayerById(this.getIdFromHeaders(socket));
    if(player){
      this.gameManager.game.removePlayer(player);
      if(this.gameManager.game.getNbPlayers() === 0){
        this.gameManager.resetGame();
      }
    }
  }

}
