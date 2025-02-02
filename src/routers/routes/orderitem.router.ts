import { Router } from "express";
import {
  createOrderItem,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
} from "../../controllers/orderitem.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const orderItemRouter = Router();

orderItemRouter.post("/", checkAuth, createOrderItem);
orderItemRouter.get("/:orderId", checkAuth, getOrderItemsByOrder);
orderItemRouter.put("/:orderId", checkAuth, updateOrderItem);
orderItemRouter.delete("/:orderId", checkAuth, deleteOrderItem);

export default orderItemRouter;
