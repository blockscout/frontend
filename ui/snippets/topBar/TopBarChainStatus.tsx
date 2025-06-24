import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TextSeparator from 'ui/shared/TextSeparator';

import useIsMobile from '../../../lib/hooks/useIsMobile';
import { useHomeChainSelector } from '../../shared/HomeChainSelector';
import TopBarChainSelector from './TopBarChainSelector';

const TopBarChainStats = () => {
  const isMobile = useIsMobile();
  const { isLoading } = useHomeChainSelector();

  return (
    <Flex
      alignItems="center"
      fontSize="xs"
      fontWeight={ 500 }
    >
      <Flex alignItems="center" columnGap={ 1 }>
        <Skeleton loading={ isLoading }>
          <chakra.span
            fontSize="var(--kda-explorer-top-bar-font-size)"
            color="text.secondary"
          >{ !isMobile ? config.app.name : config.app.shortName } (v{ config.app.version }) </chakra.span>
        </Skeleton>
        <TextSeparator color="transparent"/>
        <Skeleton loading={ isLoading }>
          <TopBarChainSelector/>
        </Skeleton>
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBarChainStats);
