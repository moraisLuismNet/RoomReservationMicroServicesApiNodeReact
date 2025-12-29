import { Router } from "express";
import express from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const paymentController = new PaymentController();

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount in cents
 *               currency:
 *                 type: string
 *                 description: Currency code (e.g., 'usd')
 *               reservationId:
 *                 type: integer
 *                 description: Related reservation ID
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                 paymentIntentId:
 *                   type: string
 *       400:
 *         description: Invalid request parameters
 */
router.post("/create-payment-intent", paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - amount
 *               - currency
 *             properties:
 *               reservationId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               productName:
 *                 type: string
 *               productDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session created
 */
router.post(
  "/create-checkout-session",
  paymentController.createCheckoutSession
);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment and update reservation status
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post("/confirm", paymentController.confirmPayment);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook
);

export default router;
