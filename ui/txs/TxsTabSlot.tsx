import React from 'react';

import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

interface Props {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
}

const TxsTabSlot = ({ pagination, isPaginationVisible }: Props) => {
  if (!isPaginationVisible) {
    return null;
  }

  return <Pagination my={ 1 } { ...pagination }/>;
};

export default TxsTabSlot;
