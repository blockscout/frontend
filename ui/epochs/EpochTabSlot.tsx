import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import { nbsp } from 'lib/html-entities';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import Pagination from 'ui/shared/pagination/Pagination';

interface Props {
  pagination: PaginationParams;
  totalCount: number;
}

const EpochTabSlot = ({ pagination, totalCount }: Props) => {

  return (
    <Flex
      alignItems="center"
      columnGap={ 8 }
      display={{ base: 'none', lg: 'flex' }}
    >
      <Box display="inline-flex" alignItems="center">
        <IconSvg name="star_outline" color="blue.400" boxSize={ 5 } mr={ 2 }/>
        <Text as="span" fontSize="sm" paddingY="2">
          Total Epoch's since genesis:{ nbsp }{ ' ' }
          <LinkInternal href="">{ totalCount }</LinkInternal>
        </Text>
      </Box>
      <Pagination my={ 1 } { ...pagination }/>
    </Flex>
  );
};

export default EpochTabSlot;
