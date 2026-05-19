import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: () => void;
  isLoading?: boolean;
}

const TxsRefreshButton = ({ onClick, isLoading }: Props) => {
  return (
    <IconButton
      aria-label="Refresh transactions"
      variant="pagination"
      boxSize={ 8 }
      onClick={ onClick }
      disabled={ isLoading }
    >
      <IconSvg name="refresh" boxSize={ 5 }/>
    </IconButton>
  );
};

export default React.memo(TxsRefreshButton);
