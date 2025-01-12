import { Router } from "express";
import { getNotifications, createNotification, markAsRead, deleteNotification } from "../../controllers/notification.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const notificationRouter = Router();

notificationRouter.get("/", checkAuth, getNotifications);
notificationRouter.post("/", checkAuth, createNotification);
notificationRouter.put("/:notificationId/read", checkAuth, markAsRead);
notificationRouter.delete("/:notificationId", checkAuth, deleteNotification);

export default notificationRouter;
