import { Router } from "express";
import { editUser, getUser } from "../../controllers/user.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";


const userRouter = Router();

userRouter.get("/", checkAuth, getUser);
userRouter.put("/", checkAuth, editUser);

export default userRouter;
