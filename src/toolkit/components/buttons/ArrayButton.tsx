// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { IconButtonProps } from 'src/toolkit/chakra/icon-button';

import AddButton from './AddButton';
import RemoveButton from './RemoveButton';

interface Props extends Omit<IconButtonProps, 'type'> {
  index: number;
  type: 'add' | 'remove';
}

const ArrayButton = ({ type, index, onClick, ...props }: Props) => {

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(event);
  }, [ onClick ]);

  const Button = type === 'add' ? AddButton : RemoveButton;

  return (
    <Button
      as="div"
      role="button"
      data-index={ index }
      size="2xs_alt"
      onClick={ handleClick }
      { ...props }
    />
  );
};

export default React.memo(ArrayButton);
