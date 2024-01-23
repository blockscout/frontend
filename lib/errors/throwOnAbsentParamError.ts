export default function throwOnAbsentParamError(param: unknown) {
  if (!param) {
    throw new Error('Required param not provided', { cause: { status: 404 } });
  }
}
