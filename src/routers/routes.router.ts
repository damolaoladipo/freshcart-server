


const v1Routes = Router();

v1Routes.use("/auth", authRouter);
v1Routes.use("/user", userRouter);