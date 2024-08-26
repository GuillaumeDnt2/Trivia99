import { Test, TestingModule } from "@nestjs/testing";
import { TriviaGateway } from "./trivia.gateway";
import { Server } from "socket.io";
import { Game } from "./game";

describe("TriviaGateway", () => {
  let gateway: TriviaGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TriviaGateway],
    }).compile();

    gateway = module.get<TriviaGateway>(TriviaGateway);
    server = new Server();
    gateway.server = server;
    gateway.game = new Game(server);
  });

  //Todo: Add actual tests
  it("should be defined", () => {
    expect(gateway).toBeDefined();
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

  it("should emit start message on start", () => {
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    const spy = jest.spyOn(server, "emit");
    gateway.game.startGame();
    expect(spy).toHaveBeenCalledWith("startGame", { msg: "The game has started" });
  });

  it("should send a question every 10000ms", async () => {
    jest.useFakeTimers();
    const socket = { id: "1", emit: jest.fn() };
    gateway.game.addPlayer(socket.id, "Player1");
    const spy = jest.spyOn(server, "emit");
    const spySocket = jest.spyOn(socket, "emit");

    gateway.game.startGame();

    expect(gateway.game.getPlayerById(socket.id).getCurrentQuestion()).toBeUndefined();

    // Clear previous calls
    spy.mockClear();

    // Advance time by 10000ms
    jest.advanceTimersByTime(10000);
    await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.game.getPlayerById(socket.id).getCurrentQuestion()).toBeDefined();
    //expect(spySocket).toHaveBeenCalledWith("userInfo", expect.any(Object));

    // Clear previous calls
    spy.mockClear();

    // Advance time by another 10000ms
    jest.advanceTimersByTime(10000);
    //await Promise.resolve(); // Allow any pending Promises to resolve

    expect(gateway.game.getPlayerById(socket.id).getNbQuestions()).toBe(2);

    jest.useRealTimers();
  });

});
