// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import * as addressStubs from 'src/slices/address/stubs/address';

import * as PoolEntity from 'src/features/dex-pools/components/entity/PoolEntity';
import PoolInfo from 'src/features/dex-pools/pages/details/PoolInfo';
import { POOL } from 'src/features/dex-pools/stubs';
import getPoolLinks from 'src/features/dex-pools/utils/get-pool-links';
import { getPoolTitle } from 'src/features/dex-pools/utils/get-pool-title';

import config from 'src/config';
import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import InfoPopoverButton from 'src/shared/buttons/InfoPopoverButton';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import VerifyWith from 'src/shared/links/VerifyWith';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

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

      return <ApiFetchAlert/>;
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
        <InfoPopoverButton>
          { `This Liquidity Provider (LP) token represents ${ data?.base_token_symbol }/${ data?.quote_token_symbol } pairing.` }
        </InfoPopoverButton>
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
