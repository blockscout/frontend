import { Skeleton, Icon as ChakraIcon } from '@chakra-ui/react';
import type { IconProps, As } from '@chakra-ui/react';
import React from 'react';

interface Props extends IconProps {
  isLoading?: boolean;
  as: As;
}

const Icon = ({ isLoading, ...props }: Props, ref: React.LegacyRef<SVGSVGElement>) => {
  return (
    <Skeleton isLoaded={ !isLoading } boxSize={ props.boxSize } w={ props.w } h={ props.h } borderRadius={ props.borderRadius }>
      <ChakraIcon { ...props } ref={ ref }/>
    </Skeleton>
  );
};

export default React.memo(React.forwardRef(Icon));
