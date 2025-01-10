import axios from "axios";
import { IPaymentGateway } from "../../utils/interface.util";


export class FlutterwaveService implements IPaymentGateway {
  private readonly FLUTTERWAVE_API_BASE = "https://api.flutterwave.com/v3";
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }): Promise<any> {
    const response = await axios.post(
      `${this.FLUTTERWAVE_API_BASE}/payments`,
      {
        tx_ref: paymentData.reference,
        amount: paymentData.amount,
        currency: "USD",
        redirect_url: paymentData.callback_url,
        customer: {
          email: paymentData.email,
        },
      },
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return response.data;
  }

  async verifyPayment(reference: string): Promise<any> {
    const response = await axios.get(
      `${this.FLUTTERWAVE_API_BASE}/transactions/${reference}/verify`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return response.data;
  }
}
