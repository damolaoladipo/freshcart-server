import { Router } from "express";
import { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  applyDiscount,
  removeDiscount,
} from "../../controllers/product.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const productRouter = Router();

productRouter.post("/", checkAuth, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getProductById);
productRouter.put("/:productId", checkAuth, updateProduct);
productRouter.delete("/:productId", checkAuth, deleteProduct);
productRouter.put("/:productId/discount", checkAuth, applyDiscount);
productRouter.put("/:productId/discount/remove", checkAuth, removeDiscount);

export default productRouter;
