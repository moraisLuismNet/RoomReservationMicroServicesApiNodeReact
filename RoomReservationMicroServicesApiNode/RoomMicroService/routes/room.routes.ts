import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();
const roomController = new RoomController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         roomId:
 *           type: integer
 *         roomNumber:
 *           type: string
 *         roomTypeId:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         imageRoom:
 *           type: string
 *         roomType:
 *           $ref: '#/components/schemas/RoomType'
 *     CreateRoomRequest:
 *       type: object
 *       required:
 *         - roomNumber
 *         - roomTypeId
 *       properties:
 *         roomNumber:
 *           type: string
 *           description: Unique room number (e.g., "101", "202")
 *         roomTypeId:
 *           type: integer
 *           description: ID of the room type
 *         isActive:
 *           type: boolean
 *           description: Whether the room is active
 *           default: true
 *         imageRoom:
 *           type: string
 *           description: URL or path to room image
 *     UpdateRoomRequest:
 *       type: object
 *       properties:
 *         roomNumber:
 *           type: string
 *         roomTypeId:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         imageRoom:
 *           type: string
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms with their room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/", roomController.getAllRooms);

/**
 * @swagger
 * /api/rooms/available:
 *   get:
 *     summary: Get available rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of active rooms with their room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/available", roomController.getAvailableRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room found with room type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 */
router.get("/:id", roomController.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomRequest'
 *           example:
 *             roomNumber: "101"
 *             roomTypeId: 1
 *             isActive: true
 *             imageRoom: "https://example.com/room101.jpg"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post("/", authMiddleware, adminMiddleware, roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomRequest'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put("/:id", authMiddleware, adminMiddleware, roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       204:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  roomController.deleteRoom
);

export default router;
