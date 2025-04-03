import { chakra } from '@chakra-ui/react';
import React from 'react';

import { CloseButton } from 'toolkit/chakra/close-button';

interface Props {
  onClick: (e: React.SyntheticEvent) => void;
  isDisabled?: boolean;
  className?: string;
  isVisible?: boolean;
}

const ClearButton = ({ onClick, isDisabled, isVisible = true, className }: Props) => {
  return (
    <CloseButton
      disabled={ isDisabled || !isVisible }
      className={ className }
      aria-label="Clear input"
      title="Clear input"
      onClick={ onClick }
      opacity={ isVisible ? 1 : 0 }
      visibility={ isVisible ? 'visible' : 'hidden' }
    />
  );
};

export default chakra(ClearButton);
