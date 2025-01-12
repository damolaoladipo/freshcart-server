import { Router } from "express";
import { 
  getWishList, 
  addProductToWishList, 
  removeProductFromWishList, 
  updateProductQuantityInWishList 
} from "../../controllers/wishlist.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const wishListRouter = Router();

wishListRouter.get("/", checkAuth, getWishList);
wishListRouter.post("/product", checkAuth, addProductToWishList);
wishListRouter.delete("/product/:productId", checkAuth, removeProductFromWishList);
wishListRouter.put("/product/:productId", checkAuth, updateProductQuantityInWishList);

export default wishListRouter;
