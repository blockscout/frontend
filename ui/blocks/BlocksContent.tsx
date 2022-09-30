import { Box, Text, Show } from '@chakra-ui/react';
import React from 'react';

import BlocksList from 'ui/blocks/BlocksList';
import BlocksTable from 'ui/blocks/BlocksTable';
import Pagination from 'ui/shared/Pagination';

const BlocksContent = () => {
  return (
    <>
      <Text>Total of 15,044,883 blocks</Text>
      <Show below="lg"><BlocksList/></Show>
      <Show above="lg"><BlocksTable/></Show>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        <Pagination currentPage={ 1 }/>
      </Box>
    </>
  );
};

export default BlocksContent;
