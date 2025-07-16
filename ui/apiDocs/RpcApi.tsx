import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';

const RpcApi = () => {
  return (
    <Box>
      <Text>
        This API is provided for developers transitioning applications from Etherscan to BlockScout and applications requiring general API and data support.
        It supports GET and POST requests.
      </Text>
      <Link href="https://docs.blockscout.com/for-users/api/rpc-endpoints" external mt={ 6 }>View modules</Link>
    </Box>
  );
};

export default React.memo(RpcApi);
