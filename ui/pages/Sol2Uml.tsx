import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sol2UmlDiagram from 'ui/sol2uml/Sol2UmlDiagram';

const Sol2Uml = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const addressHash = router.query.address?.toString() || '';

  return (
    <Page>
      <PageTitle text="Solidity UML diagram"/>
      <Flex mb={ 10 }>
        <span>For contract</span>
        <Address ml={ 3 }>
          <AddressIcon address={{ hash: addressHash, is_contract: true, implementation_name: null }}/>
          <AddressLink hash={ addressHash } type="address" ml={ 2 } truncation={ isMobile ? 'constant' : 'dynamic' }/>
        </Address>
      </Flex>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </Page>
  );
};

export default Sol2Uml;
