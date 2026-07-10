export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  role?: string;
  user?: any;
  error?: string;
  errors?: any;
}
