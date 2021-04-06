import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase();
  });

  it("Should be able to add a new specification to a car", async () => {
    await createCarSpecificationUseCase.execute();
  });
});
