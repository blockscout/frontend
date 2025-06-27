export type InputType = 'address' | 'cluster_name';

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function detectInputType(input: string): InputType {
  if (!input || input.trim().length === 0) {
    return 'cluster_name';
  }

  const trimmedInput = input.trim();

  if (EVM_ADDRESS_PATTERN.test(trimmedInput)) {
    return 'address';
  }

  return 'cluster_name';
}

export function isEvmAddress(address: string): boolean {
  if (!address) return false;
  return EVM_ADDRESS_PATTERN.test(address.trim());
}
