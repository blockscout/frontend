import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: () => void;
}

const ButtonBackTo = ({ onClick }: Props) => {
  return (
    <IconButton>
      <IconSvg
        name="arrows/east"
        boxSize={ 6 }
        transform="rotate(180deg)"
        color="icon.backTo"
        _hover={{ color: 'link.primary.hover' }}
        onClick={ onClick }
      />
    </IconButton>
  );
};

export default React.memo(ButtonBackTo);
