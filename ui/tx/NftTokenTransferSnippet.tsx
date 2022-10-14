import { Flex, Link, Text, Icon } from '@chakra-ui/react';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';
import link from 'lib/link/link';
import TokenSnippet from 'ui/shared/TokenSnippet';

interface Props {
  value: string;
  tokenId: string;
  hash: string;
  symbol: string;
}

const NftTokenTransferSnippet = (props: Props) => {
  const num = props.value === '1' ? '' : props.value;
  const url = link('token_instance_item', { hash: props.hash, id: props.tokenId });

  return (
    <Flex alignItems="center">
      <Text fontWeight={ 500 } as="span">For { num } token ID:</Text>
      <Icon as={ nftIcon } boxSize={ 6 } ml={ 3 } mr={ 1 }/>
      <Link href={ url } fontWeight={ 600 }>{ props.tokenId }</Link>
      <TokenSnippet symbol={ props.symbol } hash={ props.hash } name="Foo" ml={ 3 }/>
    </Flex>
  );
};

export default React.memo(NftTokenTransferSnippet);
