import { Router } from "express";
import { 
  createCart,
  getCart,
  addToCarts,
  removeFromCart,
  applyCoupon,
  checkout, 
  updateProductQuantity,
  clearCart
} from "../../controllers/cart.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const cartRouter = Router();

cartRouter.post("/", checkAuth, createCart);
cartRouter.get("/:userId", checkAuth, getCart);
cartRouter.put("/:userId/add", checkAuth, addToCarts);
cartRouter.put("/userId/update", checkAuth, updateProductQuantity)
cartRouter.put("/:userId/remove", checkAuth, removeFromCart);
cartRouter.put("/:userId/checkout", checkAuth, checkout);
cartRouter.put("/userId/clear", checkAuth, clearCart)
cartRouter.put("/:userId/coupon", checkAuth, applyCoupon);

export default cartRouter;
