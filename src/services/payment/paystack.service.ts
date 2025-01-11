import axios from "axios";
import { IPaymentGateway, IResult } from "../../utils/interface.util";

import { config } from "dotenv";

config();

export class PaystackService implements IPaymentGateway {
  static initializePayment(arg0: {
    email: string;
    amount: number;
    currency: any;
    reference: string;
    callback_url: any;
  }): IResult {
    let result: IResult = {
      error: true,
      message: "Payment initialization not implemented yet.",
      code: 501,
      data: {},
    };
    return result;
  }

  private readonly PAYSTACK_API_BASE = process.env.PAYSTACK_API_KEY as string;
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * @name initializePayment
   * @param paymentData - Payment details to initialize the payment
   * @returns { Promise<IResult> }
   */
  public async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (
      !paymentData.email ||
      !paymentData.amount ||
      !paymentData.reference ||
      !paymentData.callback_url
    ) {
      result.error = true;
      result.message = "Last name is a required field";
      result.code = 400;
      result.data;

      return result;
    }

    const url = `${this.PAYSTACK_API_BASE}/transaction/initialize`;

    const response: IResult = await axios.post(url, paymentData, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });

    result.error = true;
    result.message = "Payment verified successfully.";
    result.code = 400;
    result.data = response.data;
    return result;
  }

  /**
   * @name verifyPayment
   * @param reference - Reference ID for the payment to verify
   * @returns {Promise<IResult>}
   */
  public async verifyPayment(reference: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (!reference) {
      result.error = true;
      (result.message = "Reference is required to verify payment."),
        (result.code = 400);
      result.data;

      return result;
    }

    const url = `${this.PAYSTACK_API_BASE}/transaction/verify/${reference}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });

      (result.error = false),
        (result.message = "Payment verified successfully."),
        (result.code = 200),
        (result.data = response.data);
    } catch (error: any) {
      result.error = true;
      result.message =
        error.response?.data?.message || "Failed to verify payment.";
      result.code = error.response?.status || 500;
      result.data = error.response?.data || {};
    }
    return result;
  }
}
