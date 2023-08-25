import type { StyleProps } from '@chakra-ui/react';
import { Flex, chakra, Skeleton, shouldForwardProp } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogo from 'ui/shared/TokenLogo';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data?: Pick<TokenInfo, 'address' | 'icon_url' | 'name' | 'symbol'>;
  className?: string;
  logoSize?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  hideSymbol?: boolean;
  hideIcon?: boolean;
  maxW: StyleProps['maxW'];
}

/**
 * @deprecated use `ui/shared/entities/token/**` instead
 */
const TokenSnippet = ({ data, className, logoSize = 6, isDisabled, hideSymbol, hideIcon, isLoading, maxW }: Props) => {

  const withSymbol = data && data.symbol && !hideSymbol;
  const columnGap = 2;

  return (
    <Flex className={ className } alignItems="center" columnGap={ columnGap } w="100%" overflow="hidden">
      { !hideIcon && <TokenLogo boxSize={ logoSize } data={ data } isLoading={ isLoading }/> }
      <AddressLink
        flexShrink={ 0 }
        hash={ data?.address || '' }
        alias={ data?.name || 'Unnamed token' }
        type="token"
        isDisabled={ isDisabled }
        isLoading={ isLoading }
        maxW={ withSymbol ?
          `calc(80% - ${ (logoSize + columnGap * 2) * 4 }px)` :
          `calc(${ maxW || '100%' } - ${ (logoSize + columnGap) * 4 }px)`
        }
        overflow="hidden"
        textOverflow="ellipsis"
      />
      { withSymbol && (
        <Skeleton isLoaded={ !isLoading } color="text_secondary" maxW="20%" display="flex">
          <div>(</div>
          <TruncatedValue value={ data.symbol } display="block" wordBreak="break-all"/>
          <div>)</div>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default chakra(TokenSnippet, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    if (isChakraProp && prop !== 'maxW') {
      return false;
    }

    return true;
  },
});
