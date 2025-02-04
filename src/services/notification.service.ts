import mailgun from 'mailgun-js';
import { IResult } from '../utils/interface.util';

class NotificationService {
  private mg: mailgun.Mailgun;

  constructor() {
    this.mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY as string,
      domain: process.env.MAILGUN_DOMAIN as string,
    });
  }

  /**
   * @name sendOrderConfirmation
   * @description Sends an order confirmation email to the user
   * @param email - Recipient email address
   * @param orderDetails - Details about the order
   */
  public async sendOrderConfirmation(email: string, orderDetails: any): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const { orderId, totalAmount, items } = orderDetails;

      const emailData = {
        from: `Freshcart <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: `Order Confirmation - #${orderId}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Order ID: ${orderId}</p>
          <p>Total Amount: $${totalAmount}</p>
          <p>Items:</p>
          <ul>
            ${items.map((item: any) => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}
          </ul>
          <p>We’ll notify you once your order is shipped.</p>
        `,
      };

      await this.mg.messages().send(emailData);
      result.message = "Order confirmation email sent successfully";
    } catch (error) {
      result.error = true;
      result.message = "Failed to send order confirmation email";
      result.code = 500;
    }

    return result;
  }

  /**
   * @name sendShippingNotification
   * @description Sends a shipping notification email to the user
   * @param email - Recipient email address
   * @param shipmentDetails - Details about the shipment
   */
  public async sendShippingNotification(email: string, shipmentDetails: any): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const { trackingNumber, carrier, estimatedDelivery } = shipmentDetails;

      const emailData = {
        from: `Freshcart <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: `Your Order Has Been Shipped!`,
        html: `
          <h1>Your order is on its way!</h1>
          <p>Tracking Number: ${trackingNumber}</p>
          <p>Carrier: ${carrier}</p>
          <p>Estimated Delivery: ${estimatedDelivery}</p>
          <p>You can track your shipment your dasboard.</p>
        `,
      };


      await this.mg.messages().send(emailData);
      result.message = "Shipping notification email sent successfully";
    } catch (error) {
      result.error = true;
      result.message = "Failed to send shipping notification email";
      result.code = 500;
    }

    return result;
  }

  /**
   * @name sendPromotionalEmail
   * @description Sends promotional emails to a list of users
   * @param emails - Array of recipient email addresses
   * @param promotionDetails - Details about the promotion
   */
  public async sendPromotionalEmail(emails: string[], promotionDetails: any): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const { subject, body } = promotionDetails;

      const emailData = {
        from: `Freshcart <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        to: emails.join(','),
        subject: subject,
        html: `
          <h1>${promotionDetails.title}</h1>
          <p>${body}</p>
          <p><a href="${promotionDetails.link}">Shop Now</a></p>
        `,
      };

      await this.mg.messages().send(emailData);
      result.message = "Promotional emails sent successfully";
    } catch (error) {
      result.error = true;
      result.message = "Failed to send promotional emails";
      result.code = 500;
    }

    return result;
  }
}

export default new NotificationService();
