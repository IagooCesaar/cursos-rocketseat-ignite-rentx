import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/appError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category Use Case", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("Should be able to create a category", async () => {
    const newCategory = {
      name: "Category Test",
      description: "Category description Test",
    };
    await createCategoryUseCase.execute(newCategory);
    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      newCategory.name
    );

    expect(categoryCreated).toHaveProperty("id");
  });

  it("Should not be able to create a existing category checking by name", async () => {
    expect(async () => {
      const newCategory = {
        name: "Category Test",
        description: "Category description Test",
      };
      await createCategoryUseCase.execute(newCategory);
      await createCategoryUseCase.execute(newCategory);
    }).rejects.toBeInstanceOf(AppError);
  });
});
