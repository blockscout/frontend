import { Box, Icon, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import nftPlaceholder from 'icons/nft_shield.svg';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  hash: string;
  id: string;
  className?: string;
  isDisabled?: boolean;
  truncation?: 'dynamic' | 'constant';
}

const TokenTransferNft = ({ hash, id, className, isDisabled, truncation = 'dynamic' }: Props) => {
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
        { truncation === 'constant' ? <HashStringShorten hash={ id }/> : <HashStringShortenDynamic hash={ id } fontWeight={ 500 }/> }
      </Box>
    </Component>
  );
};

export default React.memo(chakra(TokenTransferNft));
