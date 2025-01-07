import { Router } from "express";
import {
  createOrderItem,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
} from "../../controllers/OrderItem.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const orderItemRouter = Router();

orderItemRouter.post("/", checkAuth, createOrderItem);
orderItemRouter.get("/:orderId", checkAuth, getOrderItemsByOrder);
orderItemRouter.put("/:id", checkAuth, updateOrderItem);
orderItemRouter.delete("/:id", checkAuth, deleteOrderItem);

export default orderItemRouter;
