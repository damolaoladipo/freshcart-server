import { Router } from "express";
import { 
  createProduct,
  // getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToCart,
  applyDiscount,
  removeDiscount,
  addTag,
  removeTag,
} from "../../controllers/product.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const productRouter = Router();

productRouter.post("/", checkAuth, createProduct);
// productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", checkAuth, updateProduct);
productRouter.delete("/:id", checkAuth, deleteProduct);
productRouter.post("/:productId/cart/:userId", checkAuth, addToCart);
productRouter.put("/:productId/discount", checkAuth, applyDiscount);
productRouter.put("/:productId/discount/remove", checkAuth, removeDiscount);
productRouter.put("/:productId/tag", checkAuth, addTag);
productRouter.put("/:productId/tag/remove", checkAuth, removeTag);

export default productRouter;
