export interface SignInRequest {
  email: string | null;
  phoneNumber: string | null;
  password: string;
}

export interface SignUpRequest {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
