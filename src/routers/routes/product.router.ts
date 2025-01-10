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
productRouter.get("/:id", getProductById);
productRouter.put("/:id", checkAuth, updateProduct);
productRouter.delete("/:id", checkAuth, deleteProduct);
productRouter.put("/:productId/discount", checkAuth, applyDiscount);
productRouter.put("/:productId/discount/remove", checkAuth, removeDiscount);

export default productRouter;
