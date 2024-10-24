export const ADDRESS_REGEXP = /^0x[a-fA-F\d]{40}$/;

export const ADDRESS_LENGTH = 42;

export function addressValidator(value: string | undefined) {
  if (!value) {
    return true;
  }

  return ADDRESS_REGEXP.test(value) ? true : 'Incorrect address format';
}
