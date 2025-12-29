import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
} from "../dtos/payment.dto";

const paymentService = new PaymentService();

export class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreatePaymentIntentDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { amount, reservationId } = req.body;
      const paymentIntent = await paymentService.createPaymentIntent(
        amount,
        reservationId
      );
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCheckoutSession(req: Request, res: Response) {
    try {
      // Import DTO dynamically to avoid circular dependency issues if any,
      // though typically top-level import is fine. Using top-level import.
      const dto = plainToInstance(CreateCheckoutSessionDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const {
        reservationId,
        amount,
        currency,
        productName,
        productDescription,
        userEmail,
      } = dto;

      const result = await paymentService.createCheckoutSession(
        reservationId,
        amount,
        currency,
        productName,
        productDescription,
        userEmail
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const result = await paymentService.confirmPayment(sessionId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async webhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    try {
      const result = await paymentService.handleWebhook(req.body, sig);
      res.json(result);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
}
