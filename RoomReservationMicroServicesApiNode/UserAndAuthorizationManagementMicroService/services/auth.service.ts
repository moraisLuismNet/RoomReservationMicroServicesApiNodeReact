import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { RegisterDto, LoginDto } from "../dtos/user.dto";
import { generateToken } from "../utils/jwt";
import logger from "../utils/logger";

export class AuthService {
  private get userRepository() {
    return AppDataSource.getRepository<User>("User");
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });

    await this.userRepository.save(user);
    logger.info(`User registered: ${user.email}`);

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ["email", "passwordHash", "name", "role"],
    });

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      email: user.email,
      role: user.role,
    });
    logger.info(`User logged in: ${user.email}`);

    return {
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async updateUser(email: string, updateData: any) {
    await this.userRepository.update({ email }, updateData);
    return await this.getUserByEmail(email);
  }

  async deleteUser(email: string) {
    await this.userRepository.delete({ email });
  }
}
