// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import BlockEntity from 'client/slices/block/components/entity/BlockEntity';

import { CELO_EPOCH } from 'client/features/chain-variants/celo/stubs/epoch';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

import EpochDetails from './EpochDetails';

const EpochPageContent = () => {
  const isMobile = useIsMobile();
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

  throwOnResourceLoadError(epochQuery);

  const isLoading = epochQuery.isPlaceholderData;

  const titleContentAfter = (() => {
    switch (epochQuery.data?.type) {
      case 'L1':
        return (
          <Tooltip content="Epoch finalized while Celo was still an L1 network">
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
      case 'L2':
        return (
          <Tooltip content="Epoch finalized after Celo migrated to the OP‐stack, when it became an L2 rollup">
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
    }

    return null;
  })();

  const titleSecondRow = (() => {
    if (!epochQuery.data || epochQuery.data?.start_block_number === null) {
      return null;
    }

    const isTruncated = isMobile && Boolean(epochQuery.data.end_block_number);
    const truncationProps = isTruncated ? { truncation: 'constant' as const, truncationMaxSymbols: 6 } : undefined;

    return (
      <HStack textStyle={{ base: 'heading.sm', lg: 'heading.md' }} flexWrap="wrap">
        <Box color="text.secondary">Ranging from</Box>
        <BlockEntity
          number={ epochQuery.data.start_block_number }
          variant="subheading"
          { ...truncationProps }
        />
        { epochQuery.data.end_block_number && (
          <>
            <Box color="text.secondary">to</Box>
            <BlockEntity number={ epochQuery.data.end_block_number } variant="subheading" { ...truncationProps }/>
          </>
        ) }
      </HStack>
    );
  })();

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Epoch #${ number }` }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { epochQuery.data && <EpochDetails data={ epochQuery.data } isLoading={ isLoading }/> }
    </>
  );
};

export default EpochPageContent;
