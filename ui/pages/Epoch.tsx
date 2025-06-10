import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { CELO_EPOCH } from 'stubs/epoch';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';
import EpochDetails from 'ui/epochs/EpochDetails';
import TextAd from 'ui/shared/ad/TextAd';
import { getCeloBlockLayer } from 'ui/shared/celo/migration';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const EpochPageContent = () => {
  const appProps = useAppContext();
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const epochQuery = useApiQuery('general:epoch_celo', {
    pathParams: {
      number: number,
    },
    queryOptions: {
      placeholderData: CELO_EPOCH,
    },
  });
  const configQuery = useApiQuery('general:config_celo', {
    queryOptions: {
      placeholderData: {
        l2_migration_block: 26384000,
      },
    },
  });

  throwOnResourceLoadError(epochQuery);

  const isLoading = epochQuery.isPlaceholderData || configQuery.isPlaceholderData;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/epochs');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to epochs list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleContentAfter = (() => {
    if (!configQuery.data?.l2_migration_block || !epochQuery.data?.start_block_number) {
      return null;
    }

    const blockLayer = getCeloBlockLayer(epochQuery.data.end_block_number, configQuery.data.l2_migration_block);

    switch (blockLayer) {
      case 'L1':
        return (
          <Tooltip content="Epoch finalized while Celo was still an L1 network">
            <Tag loading={ isLoading }>L1</Tag>
          </Tooltip>
        );
      case 'L2':
        return (
          <Tooltip content="Epoch finalized after Celo migrated to the OP‐stack, when it became an L2 rollup">
            <Tag loading={ isLoading }>L2</Tag>
          </Tooltip>
        );
    }

    return null;
  })();

  const titleSecondRow = epochQuery.data ? (
    <HStack textStyle={{ base: 'heading.sm', lg: 'heading.md' }} flexWrap="wrap">
      <Box color="text.secondary">Ranging from</Box>
      <BlockEntity number={ epochQuery.data.start_block_number } variant="subheading"/>
      <Box color="text.secondary">to</Box>
      <BlockEntity number={ epochQuery.data.end_block_number } variant="subheading"/>
    </HStack>
  ) : null;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Epoch #${ number }` }
        backLink={ backLink }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { epochQuery.data && <EpochDetails data={ epochQuery.data } isLoading={ isLoading }/> }
    </>
  );
};

export default EpochPageContent;
