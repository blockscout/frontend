import { ethers } from 'ethers';

import AspectABI from '../abi/aspect.json';
export interface AspectMethod {
  Method: string;
  Signature: string;
}
export const tagList: Array<AspectMethod> = AspectABI.reduce((acc, item) => {
  if (item.type === 'function') {
    const signature = `${ item.name }(${ item.inputs.map(input => input.type).join(',') })`;
    const methodName = `Aspect ${ item.name }`;
    const methodSignature = ethers.keccak256(ethers.toUtf8Bytes(signature)).substring(0, 10);
    acc.push({ Method: methodName, Signature: methodSignature });
  }
  return acc;
}, [] as Array<AspectMethod>);
