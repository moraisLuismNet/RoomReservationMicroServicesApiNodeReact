import { Router } from "express";
import { ReservationStatusController } from "../controllers/reservation-status.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();
const reservationStatusController = new ReservationStatusController();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           enum: [pending, confirmed, checked_in, checked_out, cancelled, no_show, completed, paid]
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reservation-statuses:
 *   get:
 *     summary: Get all reservation statuses
 *     tags: [ReservationStatuses]
 *     responses:
 *       200:
 *         description: List of reservation statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservationStatus'
 */
router.get("/", reservationStatusController.getAllReservationStatuses);

/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   get:
 *     summary: Get reservation status by ID
 *     tags: [ReservationStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation status details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationStatus'
 *       404:
 *         description: Reservation status not found
 */
router.get("/:id", reservationStatusController.getReservationStatusById);

/**
 * @swagger
 * /api/reservation-statuses:
 *   post:
 *     summary: Create a new reservation status (Admin only)
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [pending, confirmed, checked_in, checked_out, cancelled, no_show, completed, paid]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation status created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  reservationStatusController.createReservationStatus
);

/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   put:
 *     summary: Update reservation status (Admin only)
 *     tags: [ReservationStatuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [pending, confirmed, checked_in, checked_out, cancelled, no_show, completed, paid]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation status updated successfully
 *       404:
 *         description: Reservation status not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  reservationStatusController.updateReservationStatus
);

/**
 * @swagger
 * /api/reservation-statuses/{id}:
 *   delete:
 *     summary: Delete reservation status (Admin only)
 *     tags: [ReservationStatuses]
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
 *         description: Reservation status deleted successfully
 *       404:
 *         description: Reservation status not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  reservationStatusController.deleteReservationStatus
);

export default router;
