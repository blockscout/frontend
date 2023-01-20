import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useAppContext } from 'lib/appContext';
import isBrowser from 'lib/isBrowser';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerification = () => {
  const appProps = useAppContext();
  const isInBrowser = isBrowser();
  const referrer = isInBrowser ? window.document.referrer : appProps.referrer;
  const hasGoBackLink = referrer && referrer.includes('/address');
  const router = useRouter();

  const hash = router.query.id?.toString();

  return (
    <Page>
      <PageTitle
        text="New smart contract verification"
        backLinkUrl={ hasGoBackLink ? referrer : undefined }
        backLinkLabel="Back to address"
      />
      { hash && (
        <Address>
          <AddressIcon address={{ hash, is_contract: true, implementation_name: null }} flexShrink={ 0 }/>
          <Text fontFamily="heading" ml={ 2 } fontWeight={ 500 } fontSize="lg" w={{ base: '100%', lg: 'auto' }} whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ hash }/>
          </Text>
          <CopyToClipboard text={ hash }/>
        </Address>
      ) }
    </Page>
  );
};

export default ContractVerification;
