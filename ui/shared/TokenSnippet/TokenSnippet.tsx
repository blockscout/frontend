import { Flex, chakra, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import AddressLink from 'ui/shared/address/AddressLink';
import TokenLogo from 'ui/shared/TokenLogo';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  data?: Pick<TokenInfo, 'address' | 'icon_url' | 'name' | 'symbol'>;
  className?: string;
  logoSize?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  hideSymbol?: boolean;
  hideIcon?: boolean;
}

const TokenSnippet = ({ data, className, logoSize = 6, isDisabled, hideSymbol, hideIcon, isLoading }: Props) => {

  const withSymbol = data && data.symbol && !hideSymbol;

  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 } maxW="100%">
      { !hideIcon && <TokenLogo boxSize={ logoSize } data={ data } isLoading={ isLoading }/> }
      <AddressLink
        flexShrink={ 0 }
        hash={ data?.address || '' }
        alias={ data?.name || 'Unnamed token' }
        type="token"
        isDisabled={ isDisabled }
        isLoading={ isLoading }
        maxW={ withSymbol ? `calc(80% - ${ logoSize * 4 + 8 * 2 }px)` : `calc(100% - ${ logoSize * 4 + 8 }px)` }
        overflow="hidden"
        textOverflow="ellipsis"
      />
      { withSymbol && (
        <Skeleton isLoaded={ !isLoading } color="text_secondary" maxW="20%" display="flex">
          <div>(</div>
          <TruncatedTextTooltip label={ data.symbol || '' }>
            <Box overflow="hidden" textOverflow="ellipsis">{ data.symbol }</Box>
          </TruncatedTextTooltip>
          <div>)</div>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default chakra(TokenSnippet);
