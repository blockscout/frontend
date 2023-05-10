import getErrorObj from './getErrorObj';

export default function getErrorObjStatusCode(error: unknown) {
  const errorObj = getErrorObj(error);

  if (!errorObj || !('statusCode' in errorObj) || typeof errorObj.statusCode !== 'number') {
    return;
  }

  return errorObj.statusCode;
}
