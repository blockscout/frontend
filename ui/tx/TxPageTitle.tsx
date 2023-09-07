import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';

interface Props {
  txQuery: UseQueryResult<Transaction>;
}

const TxPageTitle = ({ txQuery }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const isLoading = txQuery.isPlaceholderData;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to transactions list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const tags = txQuery.data?.tx_tag ? [ { label: txQuery.data.tx_tag, display_name: txQuery.data.tx_tag } ] : undefined;

  const explorers = txQuery.data ? (
    <NetworkExplorers
      type="tx"
      pathParam={ txQuery.data.hash }
      isLoading={ isLoading }
      ml="auto"
    />
  ) : null;

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          <TxEntity
            hash={ txQuery.data?.hash }
            isLoading={ isLoading }
            prefix={ !isMobile ? 'Txn ' : undefined }
            iconSize="lg"
            noLink
            variant="page-title"
            w="100%"
          />
          { !tags && isMobile && explorers }
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent>
          <EntityTags
            isLoading={ isLoading }
            tagsBefore={ tags }
          />
          { !(!tags && isMobile) && explorers }
        </PageTitle.SecondaryContent>
      </PageTitle.MainRow>
    </PageTitle.Container>
  );
};

export default React.memo(TxPageTitle);
