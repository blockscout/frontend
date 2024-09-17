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
