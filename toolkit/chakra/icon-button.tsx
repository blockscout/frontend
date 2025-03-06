import React from 'react';

import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends ButtonProps {}

// TODO @tom2drum variants for icon buttons: prev-next, top-bar, copy-to-clipboard, filter column

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { size, variant = 'plain', ...rest } = props;

    return (
      <Button
        ref={ ref }
        display="inline-flex"
        justifyContent="center"
        px="0"
        py="0"
        { ...(size ? { size } : { height: 'auto', minW: 'auto' }) }
        flexShrink="0"
        variant={ variant }
        { ...rest }
      />
    );
  },
);
