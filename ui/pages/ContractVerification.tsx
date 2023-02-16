import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractVerificationConfigRaw, SmartContractVerificationMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import isBrowser from 'lib/isBrowser';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractVerificationForm from 'ui/contractVerification/ContractVerificationForm';
import { isValidVerificationMethod, sortVerificationMethods } from 'ui/contractVerification/utils';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import ContentLoader from 'ui/shared/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerification = () => {
  const appProps = useAppContext();
  const isInBrowser = isBrowser();
  const referrer = isInBrowser ? window.document.referrer : appProps.referrer;
  const hasGoBackLink = referrer && referrer.includes('/address');
  const router = useRouter();

  const hash = getQueryParamString(router.query.id);
  const method = getQueryParamString(router.query.method) as SmartContractVerificationMethod;

  const contractQuery = useApiQuery('contract', {
    pathParams: { id: hash },
    queryOptions: {
      enabled: Boolean(hash),
    },
  });

  if (contractQuery.isError && contractQuery.error.status === 404) {
    throw Error('Not found', { cause: contractQuery.error as unknown as Error });
  }

  const configQuery = useApiQuery('contract_verification_config', {
    queryOptions: {
      select: (data: unknown) => {
        const _data = data as SmartContractVerificationConfigRaw;
        return {
          ..._data,
          verification_options: _data.verification_options.filter(isValidVerificationMethod).sort(sortVerificationMethods),
        };
      },
      enabled: Boolean(hash),
    },
  });

  React.useEffect(() => {
    if (method && hash) {
      router.replace({ pathname: '/address/[id]/contract_verification', query: { id: hash } }, undefined, { scroll: false, shallow: true });
    }
  // onMount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const isVerifiedContract = contractQuery.data?.is_verified;

  React.useEffect(() => {
    if (isVerifiedContract) {
      router.push({ pathname: '/address/[id]', query: { id: hash, tab: 'contract' } }, undefined, { scroll: false, shallow: true });
    }
  }, [ hash, isVerifiedContract, router ]);

  const content = (() => {
    if (configQuery.isError || !hash || contractQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isLoading || contractQuery.isLoading || isVerifiedContract) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm
        method={ method && configQuery.data.verification_options.includes(method) ? method : undefined }
        config={ configQuery.data }
        hash={ hash }
      />
    );
  })();

  return (
    <Page>
      <PageTitle
        text="New smart contract verification"
        backLinkUrl={ hasGoBackLink ? referrer : undefined }
        backLinkLabel="Back to contract"
      />
      { hash && (
        <Address mb={ 12 }>
          <AddressIcon address={{ hash, is_contract: true, implementation_name: null }} flexShrink={ 0 }/>
          <Text fontFamily="heading" ml={ 2 } fontWeight={ 500 } fontSize="lg" w={{ base: '100%', lg: 'auto' }} whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ hash }/>
          </Text>
          <CopyToClipboard text={ hash }/>
        </Address>
      ) }
      { content }
    </Page>
  );
};

export default ContractVerification;
