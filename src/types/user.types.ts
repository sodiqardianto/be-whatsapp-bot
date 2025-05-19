import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  email: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  user: IUserResponse;
}
