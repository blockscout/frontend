import { Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';
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
      <PageTitle.Container>
        <PageTitle.MainRow>
          <PageTitle.MainContent backLink={ backLink } alignItems="flex-start">
            <Heading as="h1" size="lg">
              Solidity UML diagram
            </Heading>
          </PageTitle.MainContent>
        </PageTitle.MainRow>
        <PageTitle.BottomRow flexWrap="wrap" columnGap={ 3 } w="100%" rowGap={ 2 }>
          <span>For contract</span>
          <AddressEntity
            address={{ hash: addressHash, is_contract: true, implementation_name: null }}
          />
        </PageTitle.BottomRow>
      </PageTitle.Container>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </>
  );
};

export default Sol2Uml;
