import { Router } from "express";
import { changePassword, createSessionToken, generateSessionToken, login, logout, register } from "../../controllers/auth.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";


const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/session-token", generateSessionToken);
authRouter.get("/refresh-token", createSessionToken);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/change-password", checkAuth, changePassword);


export default authRouter;
