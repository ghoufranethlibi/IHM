import { User } from './domain.models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface AuthPayload {
  user: User;
  token: string;
  expiresInSeconds: number;
}
