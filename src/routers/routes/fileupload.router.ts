import { Router } from "express";
import { uploadImage } from "src/controllers/uploadfile.controller";
import checkAuth from "src/middlewares/checkAuth.mdw";
import { authorizePermissions } from "src/middlewares/checkPermissions";

const fileUploadRouter = Router();

fileUploadRouter.use(checkAuth, authorizePermissions(["manage_products", "manage_own_products"]));
fileUploadRouter.post("/", uploadImage);

export default fileUploadRouter;
