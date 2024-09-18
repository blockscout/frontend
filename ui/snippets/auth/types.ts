export type Screen = {
  type: 'select_method';
} | {
  type: 'connect_wallet';
} | {
  type: 'email';
  isAccountExists?: boolean;
} | {
  type: 'otp_code';
  email: string;
} | {
  type: 'success_created_email';
} | {
  type: 'success_created_wallet';
  address: string;
}

export interface EmailFormFields {
  email: string;
  reCaptcha: string;
}

export interface OtpCodeFormFields {
  code: string;
}
