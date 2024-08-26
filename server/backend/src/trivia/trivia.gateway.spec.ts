import { Test, TestingModule } from "@nestjs/testing";
import { TriviaGateway } from "./trivia.gateway";

describe("TriviaGateway", () => {
  let gateway: TriviaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TriviaGateway],
    }).compile();

    gateway = module.get<TriviaGateway>(TriviaGateway);
  });

  //Todo: Add actual tests
  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

});
