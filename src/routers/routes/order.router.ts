import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth.mdw";
import { 
    createOrder, 
    getOrder, 
    getUserOrders, 
    updateOrderStatus 
} from "../../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/", checkAuth, createOrder);
orderRouter.get("/:id", checkAuth, getOrder);
orderRouter.put("/:id/status", checkAuth, updateOrderStatus);
orderRouter.get("/user/:userId", checkAuth, getUserOrders);

//get all orders

export default orderRouter;
