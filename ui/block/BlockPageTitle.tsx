import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Block } from 'types/api/block';

import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';

interface Props {
  blockQuery: UseQueryResult<Block>;
  heightOrHash: string;
}

const BlockPageTitle = ({ blockQuery, heightOrHash }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const isLoading = blockQuery.isPlaceholderData;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/blocks');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to blocks list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const prefix = blockQuery.data?.type === 'reorg' ? `Reorged block #` : `Block #`;

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent w={{ base: '100%', lg: '100%' }} backLink={ backLink }>
          <BlockEntity
            hash={ blockQuery.data?.hash }
            number={ blockQuery.data?.height }
            isLoading={ isLoading }
            truncation="constant"
            prefix={ !isMobile ? prefix : '#' }
            iconSize="lg"
            noLink
            variant="page-title"
          />
          <NetworkExplorers
            type="block"
            pathParam={ heightOrHash }
            isLoading={ isLoading }
            ml="auto"
          />
        </PageTitle.MainContent>
      </PageTitle.MainRow>
    </PageTitle.Container>
  );
};

export default React.memo(BlockPageTitle);
