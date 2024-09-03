import { Test, TestingModule } from "@nestjs/testing";
import { TriviaGateway } from "./trivia.gateway";
import { Server } from "socket.io";
import { Game } from "./game";
import { QuestionManager } from "./questionManager";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {config} from "rxjs";
import {serialize} from "cookie";
import {GameManager} from "./gameManager";

describe("TriviaGateway", () => {
  let gateway: TriviaGateway;
  let server: Server;
  let configService: ConfigService;
  const player1 = { id: "1", send: jest.fn(), handshake: { headers: { authorization: serialize('userId', "1") } }  };
  const player2 = { id: "2", send: jest.fn(), handshake: { headers: { authorization: serialize('userId', "2") } }  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        isGlobal: true,
      })],
      providers: [TriviaGateway, ConfigService],
    }).compile();

    gateway = module.get<TriviaGateway>(TriviaGateway);
    server = new Server();
    configService = module.get<ConfigService>(ConfigService);
    gateway.server = server;
    gateway.gameManager = new GameManager(server, configService);
  });

  afterEach(async() => {
    jest.clearAllTimers();
    gateway.gameManager.game.forceStopGame();
    await Promise.resolve();
  })

  it("should read from the .env file", () => {
    expect(configService.get("ENV_CONFIG_TRUE")).toBe("42");
  });

  it("should add a player on login", () => {
    const socket = {...player1};
    const name = "Player1";
    gateway.onLogin(name, socket);
    expect(gateway.gameManager.game.getPlayers().has(socket.id)).toBe(true);
  });

  it("should update player ready status on ready", () => {
    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1", socket);
    gateway.onReady(socket);
    expect(gateway.gameManager.game.getPlayers().get(socket.id).isReady).toBe(true);
    expect(gateway.gameManager.game.getNbReady()).toBe(1);
  });

  it("should update player ready status on unready", () => {
    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1", socket);
    gateway.onReady(socket);
    gateway.onUnready(socket);
    expect(gateway.gameManager.game.getPlayers().get(socket.id).isReady).toBe(false);
    expect(gateway.gameManager.game.getNbReady()).toBe(0);
  });

  it("should emit start message on start", async () => {
    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);
    const spy = jest.spyOn(server, "emit");
    await gateway.gameManager.game.startGame();
    expect(spy).toHaveBeenCalledWith("startGame", {
      msg: "The game has started",
    });
  });

  it("should send a question every 10000ms", async () => {
    jest.useFakeTimers();
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);

    await gateway.gameManager.game.startGame();

    expect(
      gateway.gameManager.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeUndefined();


    // Advance time by 10000ms
    jest.advanceTimersByTime(1000);
    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(
      gateway.gameManager.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeDefined();

    // Advance time by another 10000ms
    jest.advanceTimersByTime(10000);

    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.gameManager.game.getPlayerById(socket.id).getNbQuestionsInQueue()).toBe(1);

    jest.useRealTimers();
  });


  it("should launch the game if there's two players ready", async() => {
    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);
    gateway.onReady(socket);
    expect(gateway.gameManager.game.hasGameStarted()).toBe(false);
    const userId2 = '2';
    const socket2 = {...player2};
    gateway.gameManager.game.addPlayer(socket2.id, "Player2",socket2);
    gateway.onReady(socket2);

    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.gameManager.game.hasGameStarted()).toBe(true);
  });

  it("should have a target different than the attacker", () => {
    gateway.gameManager.game.addPlayer("belmondo", "jean-paul", null);
    gateway.gameManager.game.addPlayer("jarre", "jean-michel", null);
    gateway.gameManager.game.addPlayer("jeunet", "jean-pierre", null);
    const attacker = gateway.gameManager.game.getPlayerById("belmondo")
    let target = gateway.gameManager.game.getRandomPlayer(attacker);

    expect(target).toBeDefined();
    expect(target).not.toBe(attacker);
  });


  //QuestionManager
  it("should have qList defined", () => {
    let qManager = new QuestionManager(configService);
    expect(qManager.easy_questions).toBeDefined();
    expect(qManager.medium_questions).toBeDefined();
    expect(qManager.hard_questions).toBeDefined();
  });
  


  it("should give questions to players after the game has started", async () => {

    jest.useFakeTimers();

    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);
    gateway.onReady(socket);
    expect(gateway.gameManager.game.hasGameStarted()).toBe(false);
    const userId2 = '2';
    const socket2 = {...player2};
    gateway.gameManager.game.addPlayer(socket2.id, "Player2",socket2);
    gateway.onReady(socket2);

    expect(
        gateway.gameManager.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeUndefined();

    await gateway.gameManager.game.waitForTheGameToBeStarted();

    expect(gateway.gameManager.game.getNbQuestions()).toBe(150);


    // Advance time by 20200ms to make sure we have 2 questions
    for(let i = 0; i < 101; i++){
      jest.advanceTimersByTime(200);
      await Promise.resolve(); // Allow any pending Promises to resolve
    }

    expect(gateway.gameManager.game.getPlayerById(socket.id).getNbQuestionsInQueue()).toBe(2); //We also send a question when the game starts

    jest.useRealTimers();
  });


  it("should kill the player when their stack is full", async () =>{
    jest.useFakeTimers();

    const userId = '1';
    const socket = {...player1};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);
    gateway.onReady(socket);
    expect(gateway.gameManager.game.hasGameStarted()).toBe(false);
    const userId2 = '2';
    const socket2 = {...player2};
    gateway.gameManager.game.addPlayer(socket2.id, "Player2",socket2);
    gateway.onReady(socket2);

    await gateway.gameManager.game.waitForTheGameToBeStarted();

    // Advance time by 80000ms
    for(let i = 0; i < 500; i++){
      jest.advanceTimersByTime(200);
      await Promise.resolve(); // Allow any pending Promises to resolve
    }

    expect(gateway.gameManager.game.getPlayerById(socket.id).getNbQuestionsInQueue()).toBe(7);
    expect(gateway.gameManager.game.getPlayerById(socket.id).alive()).toBe(false);

    jest.useRealTimers();
  });

  it("should have 150 questions in the question list", async () => {
    await gateway.gameManager.game.startGame();
    expect(gateway.gameManager.game.getNbQuestions()).toBe(150);
  });

  it("should reset the game after some time", async () => {
    jest.useFakeTimers();
    const socket = {...player1};
    const socket2 = {...player2};
    gateway.gameManager.game.addPlayer(socket.id, "Player1",socket);
    gateway.gameManager.game.addPlayer(socket2.id, "Player2",socket2);
    gateway.onReady(socket);
    gateway.onReady(socket2);

    await gateway.gameManager.game.startGame();

    await gateway.gameManager.game.waitForTheGameToBeStarted();

    // Advance time by 80000ms to kill players
    for(let i = 0; i < 500; i++){
      jest.advanceTimersByTime(200);
      await Promise.resolve(); // Allow any pending Promises to resolve
    }

    jest.advanceTimersByTime(parseInt(gateway.configService.get<string>("END_OF_GAME_RANKING_COOLDOWN")) * 1000);
    await Promise.resolve();
    //await gateway.gameManager.waitingGameReset();

    expect(gateway.gameManager.getHowManyGamesHaveFinished()).toBe(1);
    expect(gateway.gameManager.game.hasGameStarted()).toBe(false);
    jest.useRealTimers();

  });

});
