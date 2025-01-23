import React from 'react';

import { Button, type ButtonProps } from './button';
import { Skeleton } from './skeleton';

export interface IconButtonProps extends ButtonProps {}

export const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { loading, ...rest } = props;

    return (
      <Skeleton loading={ loading } asChild ref={ ref }>
        <Button
          display="inline-flex"
          px="0"
          py="0"
          height="auto"
          minW="auto"
          flexShrink="0"
          { ...rest }
          variant={ props.variant ?? 'plain' }
        />
      </Skeleton>
    );
  },
);
