import type { SmartContractQueryMethodRead, SmartContractMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';

export type MethodFormFields = Record<string, string | Array<string>>;
export type MethodFormFieldsFormatted = Record<string, MethodArgType>;

export type MethodArgType = string | boolean | Array<MethodArgType>;

export type ContractMethodReadResult = SmartContractQueryMethodRead | ResourceError;

export type ContractMethodWriteResult = Error | { hash: `0x${ string }` | undefined } | undefined;

export type ContractMethodCallResult<T extends SmartContractMethod> =
    T extends { method_id: string } ? ContractMethodReadResult : ContractMethodWriteResult;
