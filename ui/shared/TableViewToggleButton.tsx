// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { IconButton } from 'toolkit/chakra/icon-button';

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
