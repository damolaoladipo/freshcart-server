import { Router } from "express";
import { editUser, getAllUsers, getUser } from "../../controllers/user.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";


const userRouter = Router();

userRouter.get("/", checkAuth, getUser);
userRouter.put("/edit", checkAuth, editUser);
userRouter.get("/allusers", checkAuth, getAllUsers);

export default userRouter;
