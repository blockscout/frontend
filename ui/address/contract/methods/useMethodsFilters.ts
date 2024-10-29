import React from 'react';

import type { MethodType, SmartContractMethod } from './types';

import { isReadMethod, isWriteMethod } from './utils';

interface MethodFilterType {
  type: 'method_type';
  value: MethodType;
}

interface MethodFilterName {
  type: 'method_name';
  value: string;
}

export type MethodsFilters = MethodFilterType | MethodFilterName;

interface Params {
  abi: Array<SmartContractMethod>;
}

export default function useMethodsFilters({ abi }: Params) {
  const [ methodType, setMethodType ] = React.useState<MethodType>('all');

  const onChange = React.useCallback((filters: MethodsFilters) => {
    if (filters.type === 'method_type') {
      setMethodType(filters.value);
    }
  }, [ setMethodType ]);

  return React.useMemo(() => {
    const typeFilterFn = (() => {
      switch (methodType) {
        case 'all':
          return () => true;
        case 'read':
          return isReadMethod;
        case 'write':
          return isWriteMethod;
      }
    })();

    return {
      methodType,
      onChange,
      visibleItems: abi
        .map((method, index) => typeFilterFn(method) ? index : -1)
        .filter((item) => item !== -1),
    };
  }, [ methodType, onChange, abi ]);
}
