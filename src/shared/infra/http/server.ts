import express from "express";
import swaggerUi from "swagger-ui-express";

import "express-async-errors";

import "@shared/infra/typeorm";
import "@shared/container";

import { handlingErrors } from "@shared/infra/http/middlewares/handlingErrors";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.use(handlingErrors);

app.listen(3333, () => {
  console.log("Server is running 🚀");
});
