import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import "@shared/container";

import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";

import upload from "@config/upload";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { handlingErrors } from "@shared/infra/http/middlewares/handlingErrors";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import rateLimiter from "./middlewares/rateLimiter";
import { router } from "./routes";

createConnection();
const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(rateLimiter);
app.use(express.json());

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

app.use(cors());
app.use(router);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status === 429 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);
app.use(handlingErrors);

export { app };
