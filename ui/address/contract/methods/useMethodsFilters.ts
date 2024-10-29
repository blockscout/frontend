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
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');

  const onChange = React.useCallback((filters: MethodsFilters) => {
    if (filters.type === 'method_type') {
      setMethodType(filters.value);
    } else if (filters.type === 'method_name') {
      setSearchTerm(filters.value);
    }
  }, [ setMethodType, setSearchTerm ]);

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

    const nameFilterFn = (method: SmartContractMethod) => {
      const searchTermLower = searchTerm.toLowerCase().trim();

      if (searchTermLower === '') {
        return true;
      }

      if (method.type === 'fallback') {
        return 'fallback'.includes(searchTermLower);
      }

      if (method.type === 'receive') {
        return 'receive'.includes(searchTermLower);
      }

      return method.name.toLowerCase().includes(searchTermLower);
    };

    return {
      methodType,
      searchTerm,
      onChange,
      visibleItems: abi
        .map((method, index) => typeFilterFn(method) && nameFilterFn(method) ? index : -1)
        .filter((item) => item !== -1),
    };
  }, [ methodType, searchTerm, onChange, abi ]);
}
