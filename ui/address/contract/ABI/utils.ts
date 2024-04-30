export const getNativeCoinValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return BigInt(0);
  }

  return BigInt(value);
};
