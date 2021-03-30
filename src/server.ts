import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import "express-async-errors";

import "./database";
import "./shared/container";

import { AppError } from "./errors/appError";
import { router } from "./routes";
import swaggerFile from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.use(
  (
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ): Response => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error: ${err.message}`,
    });
  }
);

app.listen(3333);
