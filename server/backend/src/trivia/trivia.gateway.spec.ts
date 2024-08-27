import { Test, TestingModule } from "@nestjs/testing";
import { TriviaGateway } from "./trivia.gateway";
import { Server } from "socket.io";
import { Game } from "./game";
import { QuestionManager } from "./questionManager";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {config} from "rxjs";

describe("TriviaGateway", () => {
  let gateway: TriviaGateway;
  let server: Server;
  let configService: ConfigService;

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
    gateway.game = new Game(server, configService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    gateway.game.stopGame();
  })

  it("should read from the .env file", () => {
    expect(configService.get("ENV_CONFIG_TRUE")).toBe("42");
  });

  it("should add a player on login", () => {
    const socket = { id: "1", send: jest.fn() };
    const name = "Player1";
    gateway.onLogin(name, socket);
    expect(gateway.game.getPlayers().has(socket.id)).toBe(true);
  });

  it("should update player ready status on ready", () => {
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    gateway.onReady(socket);
    expect(gateway.game.getPlayers().get(socket.id).isReady).toBe(true);
    expect(gateway.game.getNbReady()).toBe(1);
  });

  it("should update player ready status on unready", () => {
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    gateway.onReady(socket);
    gateway.onUnready(socket);
    expect(gateway.game.getPlayers().get(socket.id).isReady).toBe(false);
    expect(gateway.game.getNbReady()).toBe(0);
  });

  it("should emit start message on start", async () => {
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    const spy = jest.spyOn(server, "emit");
    await gateway.game.startGame();
    expect(spy).toHaveBeenCalledWith("startGame", {
      msg: "The game has started",
    });
  });

  it("should send a question every 10000ms", async () => {
    jest.useFakeTimers();
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    const spy = jest.spyOn(server, "emit");
    const spySocket = jest.spyOn(socket, "emit");

    await gateway.game.startGame();

    expect(
      gateway.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeUndefined();

    // Clear previous calls
    spy.mockClear();

    // Advance time by 10000ms
    jest.advanceTimersByTime(10000);
    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(
      gateway.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeDefined();
    //expect(spySocket).toHaveBeenCalledWith("userInfo", expect.any(Object));

    // Clear previous calls
    spy.mockClear();

    // Advance time by another 10000ms
    jest.advanceTimersByTime(10000);

    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.game.getPlayerById(socket.id).getNbQuestions()).toBe(2);

    jest.useRealTimers();
  });

  it("should have 50 questions in the question list", async () => {
    await gateway.game.startGame();
    expect(gateway.game.getNbQuestions()).toBe(50);
  });

  //QuestionManager
  it("should have qList defined", () => {
    let qManager = new QuestionManager(configService);
    expect(qManager.qList).toBeDefined();
  });
  


  it("should launch the game if there's two players ready", async() => {
    const socket = { id: "1", send: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    gateway.onReady(socket);
    expect(gateway.game.hasGameStarted()).toBe(false);
    const socket2 = { id: "2", send: jest.fn() };
    gateway.game.addPlayer(socket2.id, "Player2");
    gateway.onReady(socket2);

    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.game.hasGameStarted()).toBe(true);
  });

  it("should give questions to players after the game has started", async () => {

    jest.useFakeTimers();

    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    gateway.onReady(socket);
    const socket2 = { id: "2", emit: jest.fn() };
    gateway.game.addPlayer(socket2.id, "Player2");
    gateway.onReady(socket2);

    expect(
        gateway.game.getPlayerById(socket.id).getCurrentQuestion(),
    ).toBeUndefined();

    await gateway.game.waitForTheGameToBeStarted();


    expect(gateway.game.getNbQuestions()).toBe(50);

    // Advance time by another 10000ms
    jest.advanceTimersByTime(20000);
    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.game.getPlayerById(socket.id).getNbQuestions()).toBe(2);

    jest.useRealTimers();
  });


  it("should kill the player when their stack is full", async () =>{
    jest.useFakeTimers();
    const socket = { id: "1", send: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    gateway.onReady(socket);
    const socket2 = { id: "2", send: jest.fn() };
    gateway.game.addPlayer(socket2.id, "Player2");
    gateway.onReady(socket2);

    await gateway.game.waitForTheGameToBeStarted();

    // Advance time by 80000ms
    jest.advanceTimersByTime(80000);
    await Promise.resolve();

    expect(gateway.game.getPlayerById(socket.id).getNbQuestions()).toBe(8);
    expect(gateway.game.getPlayerById(socket.id).getAlive()).toBe(false);

    jest.useRealTimers();
  });

});
