import axios from "axios";
import ErrorResponse from "../../utils/error.util";
import { IPaymentGateway } from "../../utils/interface.util";


import { config } from "dotenv";


config()


export class PaystackService implements IPaymentGateway{
  private readonly PAYSTACK_API_BASE = "https://api.paystack.co";
  private readonly secretKey: string;
  

  constructor(secretKey: string) {
    this.secretKey = secretKey;
    console.log("Paystack secret key:", this.secretKey);
  }

  

  /**
   * @name initializePayment
   * @param paymentData - Payment details to initialize the payment
   * @returns { Promise<any> }
   */
  // async initializePayment(paymentData: {
  //   email: string;
  //   amount: number;
  //   reference: string;
  //   callback_url: string;
  // }): Promise<any> {
  //     const response = await axios.post(
  //       `${this.PAYSTACK_API_BASE}/transaction/initialize`,
  //       paymentData,
  //       { headers: { Authorization: `Bearer ${this.secretKey}` } }
  //     );

  //     return response.data;
  // }

  // async verifyPayment(reference: string): Promise<any> {
  //   const response = await axios.get(
  //     `${this.PAYSTACK_API_BASE}/transaction/verify/${reference}`,
  //     { headers: { Authorization: `Bearer ${this.secretKey}` } }
  //   );
  //   return response.data;
  // }

  async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${this.PAYSTACK_API_BASE}/transaction/initialize`,
        paymentData,
        { headers: { Authorization: `Bearer ${this.secretKey}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error("Paystack payment initialization error:", error.response?.data || error.message);
      throw new ErrorResponse("Failed to initialize payment", 500, []);
    }
  }
  
  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.PAYSTACK_API_BASE}/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${this.secretKey}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error("Paystack payment verification error:", error.response?.data || error.message);
      throw new ErrorResponse("Failed to verify payment", 500, []);
    }
  }
  
  
}