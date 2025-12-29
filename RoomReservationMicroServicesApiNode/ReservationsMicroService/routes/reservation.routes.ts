import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const reservationController = new ReservationController();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 *                   checkInDate:
 *                     type: string
 *                     format: date-time
 *                   checkOutDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, cancelled, completed]
 *                   totalPrice:
 *                     type: number
 */
router.get("/", authMiddleware, reservationController.getAllReservations);

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     summary: Get reservations by user ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 *                   checkInDate:
 *                     type: string
 *                     format: date-time
 *                   checkOutDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, cancelled, completed]
 *                   totalPrice:
 *                     type: number
 */
router.get(
  "/user/:userId",
  authMiddleware,
  reservationController.getReservationsByUserId
);

/**
 * @swagger
 * /api/reservations/room/{roomId}:
 *   get:
 *     summary: Get reservations by room ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: List of room reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get(
  "/room/:roomId",
  authMiddleware,
  reservationController.getReservationsByRoomId
);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 roomId:
 *                   type: integer
 *                 checkInDate:
 *                   type: string
 *                   format: date-time
 *                 checkOutDate:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, confirmed, cancelled, completed]
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Reservation not found
 */
router.get("/:id", authMiddleware, reservationController.getReservationById);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - checkInDate
 *               - checkOutDate
 *             properties:
 *               roomId:
 *                 type: integer
 *               checkInDate:
 *                 type: string
 *                 format: date-time
 *               checkOutDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 roomId:
 *                   type: integer
 *                 checkInDate:
 *                   type: string
 *                   format: date-time
 *                 checkOutDate:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, confirmed, cancelled, completed]
 *                 totalPrice:
 *                   type: number
 *       400:
 *         description: Invalid reservation data
 */
router.post("/", authMiddleware, reservationController.createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkInDate:
 *                 type: string
 *                 format: date-time
 *               checkOutDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 roomId:
 *                   type: integer
 *                 checkInDate:
 *                   type: string
 *                   format: date-time
 *                 checkOutDate:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, confirmed, cancelled, completed]
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Reservation not found
 */
router.put("/:id", authMiddleware, reservationController.updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     responses:
 *       204:
 *         description: Reservation cancelled successfully
 *       404:
 *         description: Reservation not found
 */
router.delete("/:id", authMiddleware, reservationController.cancelReservation);

/**
 * @swagger
 * /api/reservations/internal/{id}:
 *   patch:
 *     summary: Update a reservation status (Internal Service Use)
 *     tags: [Reservations]
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
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 */
router.patch("/internal/:id", reservationController.updateReservation);
router.get("/internal/:id", reservationController.getReservationById);

export default router;
