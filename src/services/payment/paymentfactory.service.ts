import { IPaymentGateway } from "../../utils/interface.util";
import { FlutterwaveService } from "./flutterwave.service";
import { PaystackService } from "./paystack.service";


export class PaymentGatewayFactory {
  static createGateway(provider: string): IPaymentGateway {
    switch (provider) {
      case "paystack":
        return new PaystackService(process.env.PAYSTACK_SECRET_KEY as string);
      case "flutterwave":
        return new FlutterwaveService(process.env.FLUTTERWAVE_SECRET_KEY as string);
      default:
        throw new Error("Unsupported payment provider");
    }
  }
}
