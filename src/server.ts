import express from "express";
import swaggerUi from "swagger-ui-express";

import "express-async-errors";

import "./database";
import "./shared/container";

import { handlingErrors } from "./middlewares/handlingErrors";
import { router } from "./routes";
import swaggerFile from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

app.use(handlingErrors);

app.listen(3333);
