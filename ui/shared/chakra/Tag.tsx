import { Skeleton, Tag as ChakraTag } from '@chakra-ui/react';
import type { TagProps } from '@chakra-ui/react';
import React from 'react';

import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

export interface Props extends TagProps {
  isLoading?: boolean;
}

const Tag = ({ isLoading, ...props }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {

  if (props.isTruncated && typeof props.children === 'string') {
    if (!props.children) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm" maxW="100%">
        <TruncatedTextTooltip label={ props.children }>
          <ChakraTag { ...props } ref={ ref }/>
        </TruncatedTextTooltip>
      </Skeleton>
    );
  }
  return (
    <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm" maxW="100%">
      <ChakraTag { ...props } ref={ ref }/>
    </Skeleton>
  );
};

export default React.memo(React.forwardRef(Tag));
