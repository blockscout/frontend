import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  index: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  type: 'add' | 'remove';
  className?: string;
}

const ContractMethodArrayButton = ({ className, type, index, onClick, isDisabled }: Props) => {

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick(event);
  }, [ onClick ]);

  return (
    <IconButton
      as="div"
      className={ className }
      aria-label={ type }
      data-index={ index }
      variant="outline"
      boxSize={ 5 }
      onClick={ handleClick }
      disabled={ isDisabled }
    >
      <IconSvg name={ type === 'remove' ? 'minus' : 'plus' } boxSize={ 3 }/>
    </IconButton>
  );
};

export default React.memo(chakra(ContractMethodArrayButton));
