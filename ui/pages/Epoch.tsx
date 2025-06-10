import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';
import TextAd from 'ui/shared/ad/TextAd';
import { getCeloBlockLayer } from 'ui/shared/celo/migration';
import PageTitle from 'ui/shared/Page/PageTitle';

const EpochPageContent = () => {
  const appProps = useAppContext();
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const epochQuery = useApiQuery('general:epoch_celo', {
    pathParams: {
      number: number,
    },
  });
  const configQuery = useApiQuery('general:config_celo', {
    queryOptions: {
      placeholderData: {
        l2_migration_block: 26384000,
      },
    },
  });

  const content = (() => {
    return 'FOO';
  })();

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

  const contentAfter = (() => {
    if (!configQuery.data?.l2_migration_block || !epochQuery.data?.start_block_number) {
      return null;
    }

    const blockLayer = getCeloBlockLayer(epochQuery.data.end_block_number, configQuery.data.l2_migration_block);

    switch (blockLayer) {
      case 'L1':
        return (
          <Tooltip content="Epoch finalized while Celo was still an L1 network">
            <Tag>L1</Tag>
          </Tooltip>
        );
      case 'L2':
        return (
          <Tooltip content="Epoch finalized after Celo migrated to the OP‐stack, when it became an L2 rollup">
            <Tag>L2</Tag>
          </Tooltip>
        );
    }

    return null;
  })();

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Epoch #${ number }` }
        backLink={ backLink }
        contentAfter={ contentAfter }
        isLoading={ epochQuery.isPlaceholderData || configQuery.isPlaceholderData }
      />
      { content }
    </>
  );
};

export default EpochPageContent;
