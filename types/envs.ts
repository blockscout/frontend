export type NextPublicEnvs = {
  NEXT_PUBLIC_NETWORK_NAME: string;
  NEXT_PUBLIC_APP_PROTOCOL: 'http' | 'https';
} & NextPublicEnvsAccount;

type NextPublicEnvsAccount =
{
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'false' | undefined;
} |
{
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'true';
  NEXT_PUBLIC_AUTH_URL: string;
}
