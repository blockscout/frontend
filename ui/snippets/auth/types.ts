import type { UserInfo } from 'types/api/account';

export type ScreenSuccess = {
  type: 'success_email';
  email: string;
  profile: UserInfo;
  isAuth?: boolean;
} | {
  type: 'success_wallet';
  address: string;
  profile: UserInfo;
  isAuth?: boolean;
};
export type Screen = {
  type: 'select_method';
} | {
  type: 'connect_wallet';
  isAuth?: boolean;
} | {
  type: 'email';
  isAuth?: boolean;
} | {
  type: 'otp_code';
  email: string;
  isAuth?: boolean;
} | ScreenSuccess;

export interface EmailFormFields {
  email: string;
}

export interface OtpCodeFormFields {
  code: string;
}
