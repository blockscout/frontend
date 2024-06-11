import type { AbiFunction, AbiFallback, AbiReceive } from 'abitype';

export type SmartContractMethodRead = AbiFunction & { method_id: string };
export type SmartContractMethodWrite = AbiFunction & { method_id: string } | AbiFallback | AbiReceive;
export type SmartContractMethod = SmartContractMethodRead | SmartContractMethodWrite;
