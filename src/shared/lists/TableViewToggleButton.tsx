// SPDX-License-Identifier: LicenseRef-Blockscout

// TODO: remove this component once tables in mobile are finalized
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';

interface Props {
  value: boolean;
  onClick: () => void;
  loading?: boolean;
}

const TableViewToggleButton = ({ value, onClick, loading }: Props) => {
  return (
    <IconButton
      size="md"
      variant="dropdown"
      onClick={ onClick }
      selected={ !value }
      loadingSkeleton={ loading }
    >
      <SpriteIcon name="list_view"/>
    </IconButton>
  );
};

export default React.memo(TableViewToggleButton);
