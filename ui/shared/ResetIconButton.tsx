import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onClick: () => void;
};

const ResetIconButton = ({ onClick }: Props) => {
  return (
    <Tooltip content="Reset filter">
      <IconButton ml={ 1 } variant="link" onClick={ onClick }>
        <IconSvg
          name="cross"
          boxSize={ 5 }
        />
      </IconButton>
    </Tooltip>
  );
};

export default ResetIconButton;
