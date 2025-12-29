import { Router } from "express";
import { EmailController } from "../controllers/email.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();
const emailController = new EmailController();

/**
 * @swagger
 * /api/emails/send:
 *   post:
 *     summary: Send an email
 *     tags: [Emails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing parameters
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post(
  "/send",
  authMiddleware,
  adminMiddleware,
  emailController.sendEmail
);

/**
 * @swagger
 * /api/emails/internal/send:
 *   post:
 *     summary: Send an email (Internal Service Use)
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 */
router.post("/internal/send", emailController.sendEmail);

import { EmailQueueController } from "../controllers/emailQueue.controller";
const emailQueueController = new EmailQueueController();

// Note: The user requested router.use(authenticate, authorize(["admin"]));
// But here we are mixing public/internal email sending with admin management.
// We should probably protect only the queue routes if we could, but router.use() blocks everything after.
// Since /internal/send is before this, it's safe.
// We will apply the middleware to the queue routes specifically or use router.use if these are the only ones left.

/**
 * @swagger
 * tags:
 *   name: Email Queues
 *   description: Manage email queues
 */

/**
 * @swagger
 * /api/emails/queues:
 *   get:
 *     summary: Get all queued emails
 *     tags: [Email Queues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of queued emails
 */
router.get(
  "/queues",
  authMiddleware,
  adminMiddleware,
  emailQueueController.getAll
);

/**
 * @swagger
 * /api/emails/queues/{id}:
 *   get:
 *     summary: Get a queued email by ID
 *     tags: [Email Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Email content
 */
router.get(
  "/queues/:id",
  authMiddleware,
  adminMiddleware,
  emailQueueController.getById
);

/**
 * @swagger
 * /api/emails/queues:
 *   post:
 *     summary: Queue a new email
 *     tags: [Email Queues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toEmail, subject, body, emailType]
 *             properties:
 *               toEmail:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               emailType:
 *                 type: string
 *               reservationId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Email queued
 */
router.post(
  "/queues",
  authMiddleware,
  adminMiddleware,
  emailQueueController.create
);

/**
 * @swagger
 * /api/emails/queues/{id}:
 *   put:
 *     summary: Update a queued email
 *     tags: [Email Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               errorMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated
 */
router.put(
  "/queues/:id",
  authMiddleware,
  adminMiddleware,
  emailQueueController.update
);

/**
 * @swagger
 * /api/emails/queues/{id}:
 *   delete:
 *     summary: Delete a queued email
 *     tags: [Email Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Email deleted
 */
router.delete(
  "/queues/:id",
  authMiddleware,
  adminMiddleware,
  emailQueueController.delete
);

export default router;
