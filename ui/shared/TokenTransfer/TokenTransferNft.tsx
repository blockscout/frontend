import { Box, Icon, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import nftPlaceholder from 'icons/nft_shield.svg';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  hash: string;
  id: string;
  className?: string;
  isDisabled?: boolean;
}

const TokenTransferNft = ({ hash, id, className, isDisabled }: Props) => {
  const Component = isDisabled ? Box : LinkInternal;

  return (
    <Component
      href={ isDisabled ? undefined : route({ pathname: '/token/[hash]/instance/[id]', query: { hash, id } }) }
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
    </Component>
  );
};

export default React.memo(chakra(TokenTransferNft));
