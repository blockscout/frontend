import getErrorObj from './getErrorObj';

export default function getErrorMessage(error: Error | undefined): string | undefined {
  const errorObj = getErrorObj(error);
  return errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ? errorObj.message : undefined;
}
