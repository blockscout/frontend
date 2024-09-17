export type Screen = {
  type: 'select_method';
} | {
  type: 'email';
} | {
  type: 'otp_code';
  email: string;
} | {
  type: 'success_created_email';
}

export interface EmailFormFields {
  email: string;
  reCaptcha: string;
}

export interface OtpCodeFormFields {
  code: string;
}
