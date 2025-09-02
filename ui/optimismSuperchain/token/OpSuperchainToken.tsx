import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const OpSuperchainToken = () => {
  const router = useRouter();

  const isLoading = false;
  const hash = getQueryParamString(router.query.hash);

  const secondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{ hash, is_contract: true, name: '' }}
        isLoading={ isLoading }
        variant="subheading"
      />
      <AddressQrCode hash={ hash } isLoading={ isLoading }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Unnamed token"
        secondRow={ secondRow }
      />
      <div>Coming soon 🔜</div>
    </>
  );
};

export default React.memo(OpSuperchainToken);
