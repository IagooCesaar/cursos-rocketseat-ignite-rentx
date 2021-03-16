import { Request, Response, Router } from "express";
import { v4 as uuidV4 } from "uuid";

const categoriesRoutes = Router();

const categories = [];

categoriesRoutes.post("/", (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = {
    name,
    description,
    id: uuidV4(),
  };

  categories.push(category);

  return res.status(201).send();
});

export { categoriesRoutes };
