import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *   tags:
 *     - name: Authentication
 *       description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

export default router;
