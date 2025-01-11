import axios from "axios";
import { IPaymentGateway, IResult } from "../../utils/interface.util";


import { config } from "dotenv";


config()


export class PaystackService implements IPaymentGateway{
  private readonly PAYSTACK_API_BASE = process.env.PAYSTACK_API_KEY as string
  private readonly secretKey: string;
  

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }


  /**
   * @name initializePayment
   * @param paymentData - Payment details to initialize the payment
   * @returns { Promise<any> }
   */
public  async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }): Promise<IResult> {
    if (!paymentData.email || !paymentData.amount || !paymentData.reference || !paymentData.callback_url) {
      return {
        error: true,
        message: "Invalid payment data provided.",
        code: 400,
        data: {},
      };
    }

    const url = `${this.PAYSTACK_API_BASE}/transaction/initialize`;

    try {
    const response = await axios.post( url,
        paymentData,
        { headers: { Authorization: `Bearer ${this.secretKey}` } }
      );
      return {
        error: false,
        message: "Payment verified successfully.",
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.response?.data?.message || "Failed to verify payment.",
        code: error.response?.status || 500,
        data: error.response?.data || {},
      };
  }
} 


/**
* @name verifyPayment
* @param reference - Reference ID for the payment to verify
* @returns {Promise<IResult>}
*/
public async verifyPayment(reference: string): Promise<IResult> {
  if (!reference) {
    return {
      error: true,
      message: "Reference is required to verify payment.",
      code: 400,
      data: {},
    };
  }

  const url = `${this.PAYSTACK_API_BASE}/transaction/verify/${reference}`;

  const response = await axios.get(url,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return {
      error: true,
      message: "Payment verified successfully..",
      code: 200,
      data: response.data,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.response?.data?.message || "Failed to verify payment.",
      code: error.response?.status || 500,
      data: error.response?.data || {},
    };
  } 
}