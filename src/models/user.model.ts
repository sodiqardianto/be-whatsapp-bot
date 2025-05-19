import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import { IUser, IUserInput } from "../types/user.types.js";

export class UserModel {
  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<IUser[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  static async create(userData: IUserInput): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [userData.email, hashedPassword]
    );
    const [rows] = await pool.execute<IUser[]>(
      "SELECT * FROM users WHERE id = ?",
      [(result as any).insertId]
    );
    return rows[0];
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
