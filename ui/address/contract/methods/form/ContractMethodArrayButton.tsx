import { IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  index: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  type: 'add' | 'remove';
  className?: string;
}

const ContractMethodArrayButton = ({ className, type, index, onClick, isDisabled }: Props) => {
  return (
    <IconButton
      className={ className }
      aria-label={ type }
      data-index={ index }
      variant="outline"
      w="20px"
      h="20px"
      flexShrink={ 0 }
      onClick={ onClick }
      icon={ <IconSvg name={ type === 'remove' ? 'minus' : 'plus' } boxSize={ 3 }/> }
      isDisabled={ isDisabled }
    />
  );
};

export default React.memo(chakra(ContractMethodArrayButton));
