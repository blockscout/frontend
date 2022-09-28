import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import BlocksTable from 'ui/blocks/BlocksTable';
import Pagination from 'ui/shared/Pagination';

const BlocksContent = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Text>Total of 15,044,883 blocks</Text>
      <BlocksTable/>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        <Pagination currentPage={ 1 } isMobile={ isMobile }/>
      </Box>
    </>
  );
};

export default BlocksContent;
