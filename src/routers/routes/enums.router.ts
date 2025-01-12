import { Router } from "express";
import { getEnums } from "../../controllers/enums.controller";


const enumsRouter = Router();

enumsRouter.get("/", getEnums)

export default enumsRouter;
