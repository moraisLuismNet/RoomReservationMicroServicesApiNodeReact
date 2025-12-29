import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import logger from "../utils/logger";

if (!process.env.STRIPE_SECRET_KEY) {
  logger.error("STRIPE_SECRET_KEY is not defined in environment variables!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // apiVersion: "2024-12-18.acacia" as any,
});

interface Reservation {
  id: number;
  roomId: number;
  userEmail: string;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  totalPrice: number;
  status: string;
  numberOfNights: number;
  numberOfGuests: number;
}

export class PaymentService {
  async createCheckoutSession(
    reservationId: number,
    amount: number,
    currency: string,
    productName: string = "Reservation",
    productDescription: string = "",
    userEmail: string
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${
          process.env.STRIPE_SUCCESS_URL ||
          "http://localhost:4200/payment/success"
        }?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${
          process.env.STRIPE_CANCEL_URL ||
          "http://localhost:4200/payment/cancel"
        }?reservation_id=${reservationId}`,
        metadata: {
          reservationId: reservationId.toString(),
          userEmail: userEmail,
        },
        locale: "en",
      });

      logger.info(
        `Checkout session created for reservation ${reservationId}: ${session.id}`
      );
      return {
        sessionId: session.id,
        sessionUrl: session.url,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      };
    } catch (error: any) {
      logger.error("Error creating checkout session:", {
        message: error.message,
        stack: error.stack,
        reservationId,
        userEmail,
      });
      throw error;
    }
  }

  async createPaymentIntent(amount: number, reservationId: number) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: process.env.STRIPE_CURRENCY || "usd",
        metadata: { reservationId: reservationId.toString() },
      });

      logger.info(
        `Payment intent created for reservation ${reservationId}: ${paymentIntent.id}`
      );
      return paymentIntent;
    } catch (error: any) {
      logger.error(`Error creating payment intent: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(payload: any, signature: string) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const reservationId = paymentIntent.metadata.reservationId;
        logger.info(`Payment succeeded for reservation ${reservationId}`);
        // Here you would typically notify the ReservationsMicroService via message bus or API call
        break;
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  async confirmPayment(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (
        session.payment_status === "paid" &&
        session.metadata?.reservationId
      ) {
        const reservationId = session.metadata.reservationId;
        logger.info(
          `Payment confirmed for reservation ${reservationId}. Updating status.`
        );

        // Call ReservationsMicroService to update status
        // Assuming ReservationService is running on port 7009
        const reservationServiceUrl =
          process.env.RESERVATION_SERVICE_URL || "http://localhost:7009";

        // Using fetch for inter-service communication
        const response = await fetch(
          `${reservationServiceUrl}/api/reservations/internal/${reservationId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ statusId: 2 }), // 2 = CONFIRMED (as per example)
          }
        );

        if (!response.ok) {
          logger.error(
            `Failed to update reservation status: ${response.statusText}`
          );
          throw new Error("Failed to update reservation status");
        }

        const reservationData = (await response.json()) as Reservation;

        // Send Confirmation Email
        const emailServiceUrl =
          process.env.EMAIL_SERVICE_URL || "http://localhost:7011";

        try {
          const userEmail = session.metadata?.userEmail;
          if (userEmail) {
            const checkInStr = new Date(
              reservationData.checkInDate
            ).toLocaleDateString();
            const checkOutStr = new Date(
              reservationData.checkOutDate
            ).toLocaleDateString();

            const emailBody = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h1 style="color: #4f46e5;">Booking Confirmation</h1>
                <p>Dear Customer,</p>
                <p>Your payment has been received and your booking is now confirmed.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <h2 style="color: #333;">Reservation Details:</h2>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>Reservation ID:</strong> ${reservationId}</li>
                    <li style="margin-bottom: 10px;"><strong>Entry date:</strong> ${checkInStr}</li>
                    <li style="margin-bottom: 10px;"><strong>Departure date:</strong> ${checkOutStr}</li>
                    <li style="margin-bottom: 10px;"><strong>Nights:</strong> ${reservationData.numberOfNights}</li>
                    <li style="margin-bottom: 10px;"><strong>Guests:</strong> ${reservationData.numberOfGuests}</li>
                </ul>
                <p>Thank you for choosing our hotel. We look forward to your stay!</p>
              </div>
            `;

            const emailResponse = await fetch(
              `${emailServiceUrl}/api/emails/internal/send`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: userEmail,
                  subject: "Booking Confirmation - Payment Received",
                  body: emailBody,
                }),
              }
            );

            if (!emailResponse.ok) {
              const errorText = await emailResponse.text();
              logger.error(
                `Email service failed: ${emailResponse.status} - ${errorText}`
              );
            } else {
              logger.info(`Confirmation email sent to ${userEmail}`);
            }
          } else {
            logger.warn(
              `No userEmail found in metadata for reservation ${reservationId}`
            );
          }
        } catch (emailError: any) {
          logger.error(
            `Failed to send confirmation email: ${emailError.message}`
          );
          // Don't throw, as payment was successful
        }

        return { status: "success", reservationId };
      } else {
        throw new Error("Payment not completed or invalid session");
      }
    } catch (error: any) {
      logger.error(`Error confirming payment: ${error.message}`);
      throw error;
    }
  }
}
