import { Flex, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import AddressActionButtons from 'ui/shared/AddressActionButtons';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressPageTitle = ({ addressQuery }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const isLoading = addressQuery.isPlaceholderData;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titlePrefix = addressQuery.data?.is_contract ? 'Contract ' : 'Address ';

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          <AddressEntity
            address={ addressQuery.data }
            isLoading={ isLoading }
            iconSize="lg"
            variant="page-title"
            prefix={ !isMobile ? titlePrefix : undefined }
            truncation="constant"
            noLink
            noName
          />
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent>
          <Flex columnGap={ 2 }>
            <EntityTags
              data={ addressQuery.data }
              isLoading={ isLoading }
              tagsBefore={ [
                addressQuery.data?.is_contract ? { label: 'contract', display_name: 'Contract' } : { label: 'eoa', display_name: 'EOA' },
                addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
                addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
              ] }
            />
          </Flex>
          <NetworkExplorers
            type="address"
            pathParam={ addressQuery.data?.hash }
            ml="auto"
            isLoading={ isLoading }
          />
        </PageTitle.SecondaryContent>
      </PageTitle.MainRow>
      <PageTitle.BottomRow
        flexWrap={ addressQuery.data?.token ? 'wrap' : 'nowrap' }
        columnGap={ 6 }
      >
        { addressQuery.data?.token && (
          <Flex
            alignItems="center"
            fontSize="lg"
            lineHeight={ 6 }
            fontWeight={ 500 }
          >
            <TokenEntity
              token={ addressQuery.data.token }
              isLoading={ isLoading }
              noCopy
              jointSymbol
              maxW="600px"
            />
            { addressQuery.data.token.exchange_rate && (
              <Skeleton isLoaded={ !isLoading } ml={ 1 }>
                { `$${ Number(addressQuery.data.token.exchange_rate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }` }
              </Skeleton>
            ) }
          </Flex>
        ) }
        <AddressActionButtons
          address={ addressQuery.data }
          token={ addressQuery.data?.token }
          isLoading={ isLoading }
        />
      </PageTitle.BottomRow>
    </PageTitle.Container>
  );
};

export default React.memo(AddressPageTitle);
