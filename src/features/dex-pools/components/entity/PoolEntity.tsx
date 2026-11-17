// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import type { TokenEntityData } from 'src/slices/token/components/entity/TokenEntity';
import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import { getPoolTitle } from 'src/features/dex-pools/utils/get-pool-title';

import type { EntityComponentProps, EntityIconProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf, mergeEntityData, splitByKeys } from 'src/shared/entities/entity-props';
import { useEntityOptions, useEntityRoot } from 'src/shared/entities/root';
import { useSplitCssProps } from 'src/shared/entities/split-css-props';

export interface PoolEntityData {
  pool: contractsInfo.Pool;
}

export type EntityProps = EntityComponentProps<PoolEntityData>;
export type IconProps = EntityIconProps<PoolEntityData>;

const DATA_KEYS = keysOf<PoolEntityData>()([ 'pool' ]);

const PoolEntityBase = defineEntity<PoolEntityData>({
  name: 'PoolEntity',
  data: DATA_KEYS,
  route: ({ pool }) => pool ? { pathname: '/pools/[hash]', query: { hash: pool.pool_id } } : undefined,
  singleChain: true,
  hintPrefix: 'Pool on ',
  icon: 'tokens',
  text: ({ pool }) => pool ? getPoolTitle(pool) : '',
  copyText: false,
  defaults: { truncation: 'tail' },
});

const { Root, Container, Link, Content } = PoolEntityBase;

const toToken = (iconUrl: string | undefined, symbol: string, addressHash: string): TokenEntityData['token'] => ({
  icon_url: iconUrl ?? null,
  symbol,
  address_hash: addressHash,
  name: '',
  type: 'ERC-20',
  reputation: null,
});

const TOKEN_ICON_BORDER_COLOR = { _light: 'whiteAlpha.800', _dark: 'blackAlpha.800' };

interface TokenIconFrameProps extends Pick<IconProps, 'isLoading' | 'variant'> {
  token: TokenEntityData['token'];
  isQuote?: boolean;
}

const TokenIconFrame = ({ token, isLoading, variant, isQuote }: TokenIconFrameProps) => {
  return (
    <Flex
      transform={ isQuote ? 'translateX(-8px)' : undefined }
      bgColor="bg.primary"
      borderRadius="full"
      border="1px solid"
      borderColor={ TOKEN_ICON_BORDER_COLOR }
    >
      <TokenEntity.Root token={ token }>
        <TokenEntity.Icon marginRight={ 0 } variant={ variant } isLoading={ isLoading }/>
      </TokenEntity.Root>
    </Flex>
  );
};

const Icon = (props: IconProps) => {
  const root = useEntityRoot<PoolEntityData>();
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const [ override, own ] = splitByKeys<PoolEntityData, Pick<IconProps, 'isLoading' | 'noIcon' | 'variant' | 'className'>>(rest, DATA_KEYS);
  const { pool } = mergeEntityData(root?.data, override);
  const { isLoading = options.isLoading, noIcon = options.noIcon, variant = options.variant, className } = own;

  if (noIcon || !pool) {
    return null;
  }

  return (
    <Box display="flex" className={ className } { ...css }>
      <TokenIconFrame
        token={ toToken(pool.base_token_icon_url, pool.base_token_symbol, pool.base_token_address) }
        isLoading={ isLoading }
        variant={ variant }
      />
      <TokenIconFrame
        token={ toToken(pool.quote_token_icon_url, pool.quote_token_symbol, pool.quote_token_address) }
        isLoading={ isLoading }
        variant={ variant }
        isQuote
      />
    </Box>
  );
};

const PoolEntity = (props: EntityProps) => {
  return (
    <Container w="100%" { ...props }>
      <Icon/>
      <Link><Content/></Link>
    </Container>
  );
};

Icon.displayName = 'PoolEntity.Icon';
PoolEntity.displayName = 'PoolEntity';

export default React.memo(PoolEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
};
