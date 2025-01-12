import { Router } from "express";
import { 
  getShipment, 
  createShipment, 
  updateShipmentStatus, 
  updateTrackingNumber 
} from "../../controllers/shipment.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const shipmentRouter = Router();

shipmentRouter.get("/:orderId", checkAuth, getShipment);
shipmentRouter.post("/", checkAuth, createShipment);
shipmentRouter.put("/:shipmentId/status", checkAuth, updateShipmentStatus);
shipmentRouter.put("/:shipmentId/trackingNumber", checkAuth, updateTrackingNumber);

export default shipmentRouter;
