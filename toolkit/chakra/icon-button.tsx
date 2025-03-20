import React from 'react';

import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  size?: '2xs' | 'md';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { size, variant = 'plain', ...rest } = props;

    const sizeStyle = (() => {
      switch (size) {
        case '2xs': {
          return {
            _icon: { boxSize: 5 },
            boxSize: 5,
            borderRadius: 'sm',
          };
        }
        case 'md': {
          return {
            _icon: { boxSize: 5 },
            boxSize: 8,
          };
        }
        default:
          return {};
      }
    })();

    return (
      <Button
        ref={ ref }
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        p={ 0 }
        minW="auto"
        { ...sizeStyle }
        flexShrink="0"
        variant={ variant }
        { ...rest }
      />
    );
  },
);
