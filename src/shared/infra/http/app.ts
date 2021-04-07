import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";

import "express-async-errors";

import "@shared/container";
import { handlingErrors } from "@shared/infra/http/middlewares/handlingErrors";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

createConnection();

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.use(handlingErrors);

export { app };
