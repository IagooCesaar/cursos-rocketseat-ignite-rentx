import { Router } from "express";

import { ResetUsersPasswordController } from "@modules/accounts/useCases/resetUsersPassword/ResetUsersPasswordController";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetUsersPasswordContoller = new ResetUsersPasswordController();

passwordRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordRoutes.post("/reset", resetUsersPasswordContoller.handle);

export { passwordRoutes };
