import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sol2UmlDiagram from 'ui/sol2uml/Sol2UmlDiagram';

const Sol2Uml = () => {
  const router = useRouter();

  const addressHash = router.query.address?.toString() || '';

  return (
    <>
      <PageTitle title="Solidity UML diagram"/>
      <Flex mb={ 10 } flexWrap="wrap" columnGap={ 3 }>
        <span>For contract</span>
        <AddressEntity
          address={{ hash: addressHash, is_contract: true }}
        />
      </Flex>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </>
  );
};

export default Sol2Uml;
