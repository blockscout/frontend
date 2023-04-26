import { Box, Icon, chakra, Skeleton } from '@chakra-ui/react';
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
  isLoading?: boolean;
}

const TokenTransferNft = ({ hash, id, className, isDisabled, isLoading, truncation = 'dynamic' }: Props) => {
  const Component = isDisabled || isLoading ? Box : LinkInternal;

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
      <Skeleton isLoaded={ !isLoading } boxSize="30px" mr={ 1 } borderRadius="base">
        <Icon as={ nftPlaceholder } boxSize="30px" color="inherit"/>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } maxW="calc(100% - 34px)">
        { truncation === 'constant' ? <HashStringShorten hash={ id }/> : <HashStringShortenDynamic hash={ id } fontWeight={ 500 }/> }
      </Skeleton>
    </Component>
  );
};

export default React.memo(chakra(TokenTransferNft));
