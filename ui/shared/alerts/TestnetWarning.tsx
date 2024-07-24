import { Alert, Skeleton, chakra } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import config from 'configs/app';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const TestnetWarning = ({ isLoading, className }: Props) => {
  const { t } = useTranslation('common');

  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Skeleton className={ className } isLoaded={ !isLoading }>
      <Alert status="warning">{ t('This_is_a_testnet_transaction_only') }</Alert>
    </Skeleton>
  );
};

export default React.memo(chakra(TestnetWarning));
