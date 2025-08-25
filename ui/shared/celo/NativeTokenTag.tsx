import React from 'react';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Tag, type TagProps } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

const feature = config.features.celo;

interface Props extends TagProps {}

const NativeTokenTag = (props: Props) => {

  const handleLinkClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  }, []);

  if (!feature.isEnabled || !feature.nativeTokenAddress) {
    return null;
  }

  const tooltipContent = (
    <>
      <span>This ERC-20 token represents the native CELO balance for this address and isn’t counted twice. </span>
      <Link href="https://docs.celo.org/what-is-celo/using-celo/protocol/celo-token" external onClick={ handleLinkClick }>
        Learn more
      </Link>
    </>
  );

  return (
    <Tooltip content={ tooltipContent } interactive>
      <Tag { ...props }>Native token</Tag>
    </Tooltip>
  );
};

export default React.memo(NativeTokenTag);
