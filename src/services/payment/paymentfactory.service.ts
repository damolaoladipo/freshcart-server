import { IResult } from "../../utils/interface.util";
import { FlutterwaveService } from "./flutterwave.service";
import { PaystackService } from "./paystack.service";

export class PaymentGatewayFactory {
  public static createGateway(provider: string): IResult {
    
    if (!provider) {
      return {
        error: true,
        message: "Payment provider is required.",
        code: 400,
        data: {},
      };
    }

    switch (provider) {
      case "Paystack": {
        const paystackKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackKey) {
          return {
            error: true,
            message: "Paystack secret key is missing.",
            code: 500,
            data: {},
          };
        }

        return {
          error: false,
          message: "Paystack gateway initialized successfully.",
          code: 200,
          data: new PaystackService(paystackKey),
        };
      }

      case "Flutterwave": {
        const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY;
        if (!flutterwaveKey) {
          return {
            error: true,
            message: "Flutterwave secret key is missing.",
            code: 500,
            data: {},
          };
        }

        return {
          error: false,
          message: "Flutterwave gateway initialized successfully.",
          code: 200,
          data: new FlutterwaveService(flutterwaveKey),
        };
      }

      default:
        return {
          error: true,
          message: "Unsupported payment provider.",
          code: 400,
          data: {},
        };
    }
  }
}
