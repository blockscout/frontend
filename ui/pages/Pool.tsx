import { Tag, Box, Flex, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { getPoolTitle } from 'lib/pools/getPoolTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import * as addressStubs from 'stubs/address';
import { POOL } from 'stubs/pools';
import PoolInfo from 'ui/pool/PoolInfo';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import InfoButton from 'ui/shared/InfoButton';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import VerifyWith from 'ui/shared/VerifyWith';

const Pool = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('pool', {
    pathParams: { hash, chainId: config.chain.id },
    queryOptions: {
      placeholderData: POOL,
      refetchOnMount: false,
    },
  });

  const addressQuery = useApiQuery('address', {
    pathParams: { hash: data?.contract_address },
    queryOptions: {
      enabled: Boolean(data?.contract_address),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'pool', error, isError: true });
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
          <LinkExternal h="34px" key={ link.url } href={ link.url } alignItems="center" display="inline-flex" minW="120px">
            <Image boxSize={ 5 } mr={ 2 } src={ link.image } alt={ `${ link.title } icon` }/>
            { link.title }
          </LinkExternal>
        );
      });
  }, [ externalLinks ]);

  const titleSecondRow = (
    <Flex alignItems="center" justifyContent="space-between" w="100%">
      { addressQuery.data ? <AddressEntity address={ addressQuery.data } isLoading={ addressQuery.isPlaceholderData }/> : <Box/> }
      <Flex gap={ 2 }>
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

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/pools');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to pools list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const poolTitle = data ? getPoolTitle(data) : '';

  return (
    <>
      <PageTitle
        title={ poolTitle }
        backLink={ backLink }
        beforeTitle={ data ? (
          <PoolEntity.Icon
            pool={ data }
            isLoading={ isPlaceholderData }
            size="lg"
          />
        ) : null }
        contentAfter={ <Skeleton isLoaded={ !isPlaceholderData }><Tag>Pool</Tag></Skeleton> }
        secondRow={ titleSecondRow }
        isLoading={ isPlaceholderData }
        withTextAd
      />
      { content }
    </>
  );
};

export default Pool;
