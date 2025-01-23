import React from 'react';

type Id = string | number;

interface Params<T> {
  data: Array<T>;
  idFn: (item: T) => Id;
  enabled: boolean;
}

export default function useInitialList<T>({ data, idFn, enabled }: Params<T>) {
  const [ list, setList ] = React.useState<Array<Id>>([]);

  React.useEffect(() => {
    if (enabled) {
      setList(data.map(idFn));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled ]);

  const isNew = React.useCallback((data: T) => {
    return !list.includes(idFn(data));
  }, [ list, idFn ]);

  return React.useMemo(() => {
    return {
      list,
      isNew,
    };
  }, [ list, isNew ]);
}
