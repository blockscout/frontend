import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

interface Props {
  pagination: PaginationProps;
}

const TxsTabSlot = ({ pagination }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return <Pagination my={ 1 } { ...pagination }/>;
};

export default TxsTabSlot;
