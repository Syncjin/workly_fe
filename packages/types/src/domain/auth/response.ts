type MessageResponse = {
  message: string;
};

export interface AuthForgotIdResponse extends MessageResponse {}
export interface AuthForgotPasswordResponse extends MessageResponse {}
export interface AuthResetPasswordResponse extends MessageResponse {}
