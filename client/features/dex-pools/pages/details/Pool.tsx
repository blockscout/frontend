// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import * as addressStubs from 'client/slices/address/stubs/address';

import * as PoolEntity from 'client/features/dex-pools/components/entity/PoolEntity';
import PoolInfo from 'client/features/dex-pools/pages/details/PoolInfo';
import { POOL } from 'client/features/dex-pools/stubs';
import getPoolLinks from 'client/features/dex-pools/utils/get-pool-links';
import { getPoolTitle } from 'client/features/dex-pools/utils/get-pool-title';

import isCustomAppError from 'client/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import InfoButton from 'ui/shared/InfoButton';
import VerifyWith from 'ui/shared/VerifyWith';

const Pool = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('contractInfo:pool', {
    pathParams: { hash, instanceId: config.apis.contractInfo?.instanceId },
    queryOptions: {
      placeholderData: POOL,
      refetchOnMount: false,
    },
  });

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: data?.pool_id },
    queryOptions: {
      enabled: Boolean(data?.is_contract),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'contractInfo:pool', error, isError: true });
      }

      return <DataFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return (
      <PoolInfo
        data={ data }
        isPlaceholderData={ isPlaceholderData }
      />
    );
  })();

  const externalLinks = getPoolLinks(data);
  const hasLinks = externalLinks.length > 0;

  const externalLinksComponents = React.useMemo(() => {
    return externalLinks
      .map((link) => {
        return (
          <Link external h="34px" key={ link.url } href={ link.url } alignItems="center" display="inline-flex" minW="120px">
            <Image boxSize={ 5 } mr={ 2 } src={ link.image } alt={ `${ link.title } icon` }/>
            { link.title }
          </Link>
        );
      });
  }, [ externalLinks ]);

  const poolIdOrContract = React.useMemo(() => {
    if (data?.is_contract && addressQuery.data) {
      return <AddressEntity address={ addressQuery.data } isLoading={ addressQuery.isPlaceholderData }/>;
    } else if (data?.pool_id) {
      return (
        <Skeleton loading={ isPlaceholderData } display="flex" alignItems="center" overflow="hidden">
          <Flex overflow="hidden">
            <HashStringShortenDynamic hash={ data?.pool_id }/>
          </Flex>
          <CopyToClipboard text={ data?.pool_id }/>
        </Skeleton>
      );
    }

    return null;
  }, [ data, isPlaceholderData, addressQuery.isPlaceholderData, addressQuery.data ]);

  const titleSecondRow = (
    <Flex alignItems="center" justifyContent="space-between" w="100%">
      { poolIdOrContract }
      <Flex gap={ 2 } ml={ 2 }>
        <InfoButton>
          { `This Liquidity Provider (LP) token represents ${ data?.base_token_symbol }/${ data?.quote_token_symbol } pairing.` }
        </InfoButton>
        { hasLinks && (
          <VerifyWith
            links={ externalLinksComponents }
            label="Verify with"
            longText="View in"
            shortText=""
          />
        ) }
      </Flex>
    </Flex>
  );

  const poolTitle = data ? getPoolTitle(data) : '';

  return (
    <>
      <PageTitle
        title={ poolTitle }
        beforeTitle={ data ? (
          <PoolEntity.Icon
            pool={ data }
            isLoading={ isPlaceholderData }
            variant="heading"
          />
        ) : null }
        contentAfter={ <Skeleton loading={ isPlaceholderData }><Tag>Pool</Tag></Skeleton> }
        secondRow={ titleSecondRow }
        isLoading={ isPlaceholderData }
        withTextAd
      />
      { content }
    </>
  );
};

export default Pool;
