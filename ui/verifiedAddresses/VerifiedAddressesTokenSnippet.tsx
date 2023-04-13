import { Image, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication } from 'types/api/account';

import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

interface Props {
  application: TokenInfoApplication;
  name: string;
}

const VerifiedAddressesTokenSnippet = ({ application, name }: Props) => {
  return (
    <Flex alignItems="center" columnGap={ 2 } w="100%">
      <Image
        borderRadius="base"
        boxSize={ 6 }
        objectFit="cover"
        src={ application.iconUrl }
        alt="Token logo"
        fallback={ <TokenLogoPlaceholder boxSize={ 6 }/> }
      />
      <AddressLink
        hash={ application.tokenAddress }
        alias={ name }
        type="token"
        isDisabled={ application.status === 'IN_PROCESS' }
        fontWeight={ 500 }
      />
    </Flex>
  );
};

export default React.memo(VerifiedAddressesTokenSnippet);
