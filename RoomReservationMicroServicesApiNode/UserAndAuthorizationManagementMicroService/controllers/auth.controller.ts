import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/user.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const registerDto = plainToInstance(RegisterDto, req.body);
      const errors = await validate(registerDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await authService.register(registerDto);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);
      const errors = await validate(loginDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await authService.login(loginDto);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const user = await authService.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await authService.updateUser(
        req.params.email,
        req.body
      );
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await authService.deleteUser(req.params.email);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
