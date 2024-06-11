import type { AbiFunction, AbiFallback, AbiReceive } from 'abitype';

export type SmartContractMethodRead = AbiFunction;
export type SmartContractMethodWrite = AbiFunction | AbiFallback | AbiReceive;
