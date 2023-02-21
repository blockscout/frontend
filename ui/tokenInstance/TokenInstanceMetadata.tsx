import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import RawDataSnippet from 'ui/shared/RawDataSnippet';

interface Props {
  data: TokenInstance['metadata'] | undefined;
}

const TokenInstanceMetadata = ({ data }: Props) => {
  if (!data) {
    return <Box>There is no metadata for this NFT</Box>;
  }

  return (
    <RawDataSnippet
      data={ JSON.stringify(data, undefined, 4) }
    />
  );
};

export default TokenInstanceMetadata;
