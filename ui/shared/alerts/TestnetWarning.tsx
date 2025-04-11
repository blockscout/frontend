import { Alert, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const TestnetWarning = ({ isLoading, className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Skeleton className={ className } isLoaded={ !isLoading } color="#F2B310">
      <Alert background="rgba(255, 226, 142, 0.20)" status="warning">This is a testnet transaction only</Alert>
    </Skeleton>
  );
};

export default React.memo(chakra(TestnetWarning));
