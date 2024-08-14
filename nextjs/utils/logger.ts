import pino from 'pino-http';

export const httpLogger = pino();

export function formatErrorMessage(error: any): string | undefined {
  try {
    const r = JSON.stringify(error);
    if (r !== '{}') {
      return r;
    }
  } catch {
    //
  }
  return error?.message;
}
