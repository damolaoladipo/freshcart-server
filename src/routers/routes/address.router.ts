import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.mdw";
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from "../../controllers/address.controller";


const AddressRouter = Router();

AddressRouter.post("/:userId", checkAuth, createAddress);
AddressRouter.get("/:userId", checkAuth, getUserAddresses);
AddressRouter.put("/:addressId", checkAuth, updateAddress);
AddressRouter.delete("/:addressId", checkAuth, deleteAddress);


export default AddressRouter;
