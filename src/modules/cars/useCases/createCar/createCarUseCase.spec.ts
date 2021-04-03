import { CreateCarUseCase } from "./createCarUseCase";

let createCarUseCase: CreateCarUseCase;

describe("Create car use case", () => {
  beforeEach(() => {
    createCarUseCase = new CreateCarUseCase();
  });

  it("Should be able to create a new car", async () => {
    await createCarUseCase.execute();
  });
});
