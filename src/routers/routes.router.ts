import { Router } from "express";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";



const v1Routes = Router();

v1Routes.use("/auth", authRouter);
v1Routes.use("/user", userRouter);

export default v1Routes