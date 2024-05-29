import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sol2UmlDiagram from 'ui/sol2uml/Sol2UmlDiagram';

const Sol2Uml = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const addressHash = router.query.address?.toString() || '';

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/address');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to address',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <PageTitle
        title="Solidity UML diagram"
        backLink={ backLink }
      />
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
