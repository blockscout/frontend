import { Flex, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data?: Pick<TokenInfo, 'address' | 'icon_url' | 'name' | 'symbol'>;
  className?: string;
  logoSize?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  hideSymbol?: boolean;
}

const TokenSnippet = ({ data, className, logoSize = 6, isDisabled, hideSymbol, isLoading }: Props) => {
  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 } w="100%">
      <TokenLogo boxSize={ logoSize } data={ data } isLoading={ isLoading }/>
      <AddressLink hash={ data?.address || '' } alias={ data?.name || 'Unnamed token' } type="token" isDisabled={ isDisabled } isLoading={ isLoading }/>
      { data?.symbol && !hideSymbol && (
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>({ trimTokenSymbol(data.symbol) })</span>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default chakra(TokenSnippet);
