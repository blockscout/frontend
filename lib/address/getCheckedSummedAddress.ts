import { getAddress } from 'viem';

export default function getCheckedSummedAddress(address: string): string {
  try {
    return getAddress(address);
  } catch (error) {
    return address;
  }
}
