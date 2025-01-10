import axios from "axios";
import ErrorResponse from "../../utils/error.util";
import { IPaymentGateway } from "../../utils/interface.util";


export class PaystackService implements IPaymentGateway{
  private readonly PAYSTACK_API_BASE = "https://api.paystack.co";
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * @name initializePayment
   * @param paymentData - Payment details to initialize the payment
   * @returns { Promise<any> }
   */
  async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }): Promise<any> {
      const response = await axios.post(
        `${this.PAYSTACK_API_BASE}/transaction/initialize`,
        paymentData,
        { headers: { Authorization: `Bearer ${this.secretKey}` } }
      );

      return response.data;
  }

  async verifyPayment(reference: string): Promise<any> {
    const response = await axios.get(
      `${this.PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return response.data;
  }
}
