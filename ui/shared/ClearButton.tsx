import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: (e: React.SyntheticEvent) => void;
  isDisabled?: boolean;
  className?: string;
}

const ClearButton = ({ onClick, isDisabled, className }: Props) => {
  return (
    <IconButton
      disabled={ isDisabled }
      className={ className }
      aria-label="Clear input"
      title="Clear input"
      size="sm"
      onClick={ onClick }
    >
      <IconSvg
        name="status/error"
        boxSize={ 3 }
        color={{ _light: 'gray.300', _dark: 'gray.600' }}
        _hover={{ color: { _light: 'gray.200', _dark: 'gray.500' } }}
      />
    </IconButton>
  );
};

export default chakra(ClearButton);
