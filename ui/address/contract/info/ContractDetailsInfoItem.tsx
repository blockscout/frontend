import { chakra, useColorModeValue, Flex, GridItem, Skeleton } from '@chakra-ui/react';
import React from 'react';

import Hint from 'ui/shared/Hint';

interface Props {
  label: string;
  content: string | React.ReactNode;
  className?: string;
  isLoading: boolean;
  hint?: string;
}

const ContractDetailsInfoItem = ({ label, content, className, isLoading, hint }: Props) => {
  const hintIconColor = useColorModeValue('gray.600', 'gray.400');
  return (
    <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className } alignItems="baseline">
      <Skeleton isLoaded={ !isLoading } w="170px" flexShrink={ 0 } fontWeight={ 500 }>
        <Flex alignItems="center">
          { label }
          { hint && (
            <Hint
              label={ hint }
              ml={ 2 }
              color={ hintIconColor }
              tooltipProps={{ placement: 'bottom' }}
            />
          ) }
        </Flex>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading }>{ content }</Skeleton>
    </GridItem>
  );
};

export default React.memo(chakra(ContractDetailsInfoItem));
