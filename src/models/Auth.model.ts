// src/models/Auth.ts

export interface SignUpDTO {
  email: string;
  password: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}
