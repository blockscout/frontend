import React from 'react';

import { Button, type ButtonProps } from './button';
import { Skeleton } from './skeleton';

export interface IconButtonProps extends ButtonProps {}

// TODO @tom2drum variants for icon buttons: prev-next, top-bar, copy-to-clipboard
// TODO @tom2drum fix loading state for outlined variant

export const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { loading, size, variant = 'plain', ...rest } = props;

    return (
      <Skeleton loading={ loading } ref={ ref } asChild>
        <Button
          display="inline-flex"
          justifyContent="center"
          px="0"
          py="0"
          { ...(size ? { size } : { height: 'auto', minW: 'auto' }) }
          flexShrink="0"
          variant={ variant }
          { ...rest }
        />
      </Skeleton>
    );
  },
);
