

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/activate-account/:token", activateAccount);
authRouter.get("/refresh-token", refreshToken);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.put("/change-password", checkAuth, changePassword);
authRouter.post("/resend-verification-email", resendVerificationEmail);

export default authRouter;
