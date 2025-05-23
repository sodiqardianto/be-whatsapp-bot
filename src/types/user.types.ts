import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  user: IUserResponse;
}
