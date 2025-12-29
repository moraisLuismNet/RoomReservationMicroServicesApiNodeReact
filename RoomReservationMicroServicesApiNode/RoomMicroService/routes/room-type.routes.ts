import { Router } from "express";
import { RoomTypeController } from "../controllers/room-type.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();
const roomTypeController = new RoomTypeController();

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         pricePerNight:
 *           type: number
 *         capacity:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Get all room types
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: List of room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomType'
 */
router.get("/", roomTypeController.getAllRoomTypes);

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: Room type not found
 */
router.get("/:id", roomTypeController.getRoomTypeById);

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create a new room type (Admin only)
 *     tags: [RoomTypes]
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
 *               - pricePerNight
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Room type created successfully
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
  roomTypeController.createRoomType
);

/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     summary: Update room type (Admin only)
 *     tags: [RoomTypes]
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
 *               description:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *       404:
 *         description: Room type not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  roomTypeController.updateRoomType
);

/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     summary: Delete room type (Admin only)
 *     tags: [RoomTypes]
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
 *         description: Room type deleted successfully
 *       404:
 *         description: Room type not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  roomTypeController.deleteRoomType
);

export default router;
