export default function getErrorStatusCode(error: Error | undefined): number | undefined {
  return (
    error && 'cause' in error &&
    typeof error.cause === 'object' && error.cause !== null &&
    'status' in error.cause && typeof error.cause.status === 'number' &&
    error.cause.status
  ) ||
    undefined;
}
