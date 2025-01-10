import { Router } from "express";
import { 
    changePassword, 
    forgotPassword, 
    login, 
    logout, 
    register } 
    from "../../controllers/auth.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";


const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/forgotpassword", forgotPassword)
authRouter.put("/change-password", checkAuth, changePassword);


export default authRouter;
