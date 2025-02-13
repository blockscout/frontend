import { chakra, Flex, GridItem } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import Hint from 'ui/shared/Hint';

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
  isLoading: boolean;
  hint?: string;
}

const ContractDetailsInfoItem = ({ label, children, className, isLoading, hint }: Props) => {
  return (
    <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className } alignItems="baseline">
      <Skeleton loading={ isLoading } w="170px" flexShrink={ 0 } fontWeight={ 500 }>
        <Flex alignItems="center">
          { label }
          { hint && (
            <Hint
              label={ hint }
              ml={ 2 }
              color={{ _light: 'gray.600', _dark: 'gray.400' }}
              tooltipProps={{ positioning: { placement: 'bottom' } }}
            />
          ) }
        </Flex>
      </Skeleton>
      <Skeleton loading={ isLoading }>{ children }</Skeleton>
    </GridItem>
  );
};

export default React.memo(chakra(ContractDetailsInfoItem));
