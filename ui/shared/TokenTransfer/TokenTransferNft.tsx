import { Box, Icon, Link, chakra } from '@chakra-ui/react';
import React from 'react';

import nftPlaceholder from 'icons/nft_shield.svg';
import link from 'lib/link/link';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  hash: string;
  id: string;
  className?: string;
}

const TokenTransferNft = ({ hash, id, className }: Props) => {
  return (
    <Link
      href={ link('token_instance_item', { hash, id }) }
      overflow="hidden"
      whiteSpace="nowrap"
      display="flex"
      alignItems="center"
      w="100%"
      className={ className }
    >
      <Icon as={ nftPlaceholder } boxSize="30px" mr={ 1 } color="inherit"/>
      <Box maxW="calc(100% - 34px)">
        <HashStringShortenDynamic hash={ id } fontWeight={ 500 }/>
      </Box>
    </Link>
  );
};

export default React.memo(chakra(TokenTransferNft));
