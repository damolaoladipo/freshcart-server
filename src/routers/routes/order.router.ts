import { Router } from "express";
import { 
  createOrder, 
  getOrder, 
  updateOrderStatus, 
  getUserOrders 
} from "../../controllers/order.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const orderRouter = Router();

orderRouter.post("/", checkAuth, createOrder);
orderRouter.get("/:id", checkAuth, getOrder);
orderRouter.put("/:id/status", checkAuth, updateOrderStatus);
orderRouter.get("/user/:userId", checkAuth, getUserOrders);

export default orderRouter;
