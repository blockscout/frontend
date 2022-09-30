import type { NextjsOptions } from '@sentry/nextjs/types/utils/nextjsOptions';

const config: NextjsOptions = {
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
};

export default config;
