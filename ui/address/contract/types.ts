import type { SmartContractQueryMethodRead, SmartContractMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';

export type MethodFormFields = Record<string, string>;

export type ContractMethodReadResult = SmartContractQueryMethodRead | ResourceError;

export type ContractMethodWriteResult = Error | { hash: string } | undefined;

export type ContractMethodCallResult<T extends SmartContractMethod> =
    T extends { method_id: string } ? ContractMethodReadResult : ContractMethodWriteResult;
