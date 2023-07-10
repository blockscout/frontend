import { chakra, shouldForwardProp, Tooltip, Box, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import type { HTMLAttributeAnchorTarget } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';

import TruncatedTextTooltip from '../TruncatedTextTooltip';

type CommonProps = {
  className?: string;
  truncation?: 'constant' | 'dynamic'| 'none';
  target?: HTMLAttributeAnchorTarget;
  isDisabled?: boolean;
  fontWeight?: string;
  alias?: string | null;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  query?: Record<string, string>;
}

type AddressTokenTxProps = {
  type: 'address' | 'token' | 'transaction';
  hash: 'hash';
}

type BlockProps = {
  type: 'block';
  hash: string;
  blockHeight: string;
}

type AddressTokenProps = {
  type: 'address_token';
  hash: string;
  tokenHash: string;
}

type Props = CommonProps & (AddressTokenTxProps | BlockProps | AddressTokenProps);

const AddressLink = (props: Props) => {
  const { alias, type, className, truncation = 'dynamic', hash, fontWeight, target = '_self', isDisabled, isLoading } = props;
  const isMobile = useIsMobile();

  let url;
  if (type === 'transaction') {
    url = route({ pathname: '/tx/[hash]', query: { ...props.query, hash } });
  } else if (type === 'token') {
    url = route({ pathname: '/token/[hash]', query: { ...props.query, hash } });
  } else if (type === 'block') {
    url = route({ pathname: '/block/[height_or_hash]', query: { ...props.query, height_or_hash: props.blockHeight } });
  } else if (type === 'address_token') {
    url = route({ pathname: '/address/[hash]', query: { ...props.query, hash, tab: 'token_transfers', token: props.tokenHash, scroll_to_tabs: 'true' } });
  } else {
    url = route({ pathname: '/address/[hash]', query: { ...props.query, hash } });
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

  if (isLoading) {
    return <Skeleton className={ className } overflow="hidden" whiteSpace="nowrap">{ content }</Skeleton>;
  }

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
    <LinkInternal
      className={ className }
      href={ url }
      target={ target }
      overflow="hidden"
      whiteSpace="nowrap"
      onClick={ props.onClick }
    >
      { content }
    </LinkInternal>
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
