import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import celeniumIcon from 'icons/brands/celenium.svg';
import hexToBase64 from 'lib/hexToBase64';
import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  commitment: string;
  namespace: string;
  height: number;
}

function getCeleniumUrl(props: Props) {
  const url = new URL('https://mocha.celenium.io/blob');

  url.searchParams.set('commitment', hexToBase64(props.commitment));
  url.searchParams.set('hash', hexToBase64(props.namespace));
  url.searchParams.set('height', String(props.height));

  return url.toString();
}

const CeleniumLink = (props: Props) => {
  return (
    <Flex alignItems="center" columnGap={ 2 }>
      <Icon as={ celeniumIcon } boxSize={ 5 }/>
      <LinkExternal href={ getCeleniumUrl(props) }>Blob page</LinkExternal>
    </Flex>
  );
};

export default React.memo(CeleniumLink);
