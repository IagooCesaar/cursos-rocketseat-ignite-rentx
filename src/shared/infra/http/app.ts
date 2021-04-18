import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import "@shared/container";

import express, { Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";

import upload from "@config/upload";
import { handlingErrors } from "@shared/infra/http/middlewares/handlingErrors";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

createConnection();

const app = express();

app.use(express.json());

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/api-coverage",
  express.static(
    path.resolve(__dirname, "..", "..", "..", "..", "coverage", "lcov-report")
  )
);
app.get("/api-coverage", (request: Request, response: Response) => {
  return response.sendFile(
    path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "coverage",
      "lcov-report",
      "index.html"
    )
  );
});

app.use(router);
app.use(handlingErrors);

export { app };
