import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { IAuthResponse } from "../types/user.types.js";
import { z } from "zod";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Email or password is incorrect" });
      }

      const isValidPassword = await UserModel.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Email or password is incorrect" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      const response: IAuthResponse = {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      };

      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const userData = loginSchema.parse(req.body);

      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await UserModel.create(userData);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      const response: IAuthResponse = {
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
