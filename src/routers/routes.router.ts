import { Router } from "express";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import cartRouter from "./routes/cart.router";
import notificationRouter from "./routes/notification.router";
import orderRouter from "./routes/order.router";
import paymentPartnerRouter from "./routes/paymentpartner.router";
import productRouter from "./routes/product.router";
import shipmentRouter from "./routes/shipment.router";
import transactionRouter from "./routes/transaction.router";
import wishListRouter from "./routes/wishlist.router";
import orderItemRouter from "./routes/orderitem.router";
import AddressRouter from "./routes/address.router";
import enumsRouter from "./routes/enums.router";
import fileUploadRouter from "routes/fileupload.router";



const v1Routes = Router();

v1Routes.use("/auth", authRouter);
v1Routes.use("/user", userRouter);
v1Routes.use("/address", AddressRouter)
v1Routes.use("/cart", cartRouter);
v1Routes.use("/notification", notificationRouter);
v1Routes.use("/order", orderRouter);
v1Routes.use("/orderitem", orderItemRouter)
v1Routes.use("/payment", paymentPartnerRouter);
v1Routes.use("/product", productRouter);
v1Routes.use("/shipment", shipmentRouter);
v1Routes.use("/transaction", transactionRouter);
v1Routes.use("/wishlist", wishListRouter);
v1Routes.use("/enums", enumsRouter)
v1Routes.use("/upload", fileUploadRouter)

export default v1Routes