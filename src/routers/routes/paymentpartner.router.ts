import { Router } from "express";
import { 
  createPaymentPartner, 
  getPaymentPartner, 
  updatePaymentPartner, 
  getAllPaymentPartners 
} from "../../controllers/paymentpartner.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const paymentPartnerRouter = Router();

paymentPartnerRouter.post("/", checkAuth, createPaymentPartner);
paymentPartnerRouter.get("/:id", checkAuth, getPaymentPartner);
paymentPartnerRouter.put("/:id", checkAuth, updatePaymentPartner);
paymentPartnerRouter.get("/", checkAuth, getAllPaymentPartners);

export default paymentPartnerRouter;
