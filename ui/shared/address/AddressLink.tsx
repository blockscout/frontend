import { Link, chakra, shouldForwardProp, Tooltip, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import TruncatedTextTooltip from '../TruncatedTextTooltip';

type CommonProps = {
  className?: string;
  truncation?: 'constant' | 'dynamic'| 'none';
  target?: HTMLAttributeAnchorTarget;
  isDisabled?: boolean;
  fontWeight?: string;
  alias?: string | null;
}

type AddressTokenTxProps = {
  type: 'address' | 'token' | 'transaction';
  hash: 'hash';
}

type BlockProps = {
  type: 'block';
  hash: string;
  id: string;
}

type AddressTokenProps = {
  type: 'address_token';
  hash: string;
  tokenHash: string;
}

type Props = CommonProps & (AddressTokenTxProps | BlockProps | AddressTokenProps);

const AddressLink = (props: Props) => {
  const { alias, type, className, truncation = 'dynamic', hash, fontWeight, target = '_self', isDisabled } = props;
  const isMobile = useIsMobile();

  let url;
  if (type === 'transaction') {
    url = link('tx', { id: hash });
  } else if (type === 'token') {
    url = link('token_index', { hash: hash });
  } else if (type === 'block') {
    url = link('block', { id: props.id });
  } else if (type === 'address_token') {
    url = link('address_index', { id: hash }, { tab: 'token_transfers', token: props.tokenHash, scroll_to_tabs: 'true' });
  } else {
    url = link('address_index', { id: hash });
  }

  const content = (() => {
    if (alias) {
      const text = <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ alias }</Box>;
      if (type === 'token') {
        return (
          <TruncatedTextTooltip label={ alias }>
            { text }
          </TruncatedTextTooltip>
        );
      }
      return (
        <Tooltip label={ hash } isDisabled={ isMobile }>
          { text }
        </Tooltip>
      );
    }
    switch (truncation) {
      case 'constant':
        return <HashStringShorten hash={ hash } isTooltipDisabled={ isMobile }/>;
      case 'dynamic':
        return <HashStringShortenDynamic hash={ hash } fontWeight={ fontWeight } isTooltipDisabled={ isMobile }/>;
      case 'none':
        return <span>{ hash }</span>;
    }
  })();

  if (isDisabled) {
    return (
      <chakra.span
        className={ className }
        overflow="hidden"
        whiteSpace="nowrap"
      >
        { content }
      </chakra.span>
    );
  }

  return (
    <NextLink href={ url } passHref target={ target }>
      <Link
        className={ className }
        overflow="hidden"
        whiteSpace="nowrap"
      >
        { content }
      </Link>
    </NextLink>
  );
};

const AddressLinkChakra = chakra(AddressLink, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    // forward fontWeight to the AddressLink since it's needed for underlying HashStringShortenDynamic component
    if (isChakraProp && prop !== 'fontWeight') {
      return false;
    }

    return true;
  },
});

export default React.memo(AddressLinkChakra);
