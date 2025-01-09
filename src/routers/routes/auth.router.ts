import { Router } from "express";
import { 
    changePassword, 
    login, 
    logout, 
    register, 
    resetPassword } 
    from "../../controllers/auth.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";


const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/change-password", checkAuth, changePassword);


export default authRouter;
