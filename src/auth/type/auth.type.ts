export type SigninData = {
  email: string;
  password: string;
};

export type AuthResult = {
  email: string;
  accessToken: string;
};

export type RegistrationResponse = {
  email: string;
  accessToken: string;
  message?: string;
};
