// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import type { MetadataTag as TMetadataTag } from './types';

import { useMultichainContext } from 'src/features/multichain/context';

import * as mixpanel from 'src/services/mixpanel';

import { Link, LinkExternalIcon } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

import MetadataTagIcon from './MetadataTagIcon';
import MetadataTagTooltip from './MetadataTagTooltip';
import { getTagName, getTagLinkParams } from './utils';

interface Props extends HTMLChakraProps<'span'> {
  data: TMetadataTag;
  addressHash?: string;
  isLoading?: boolean;
  noLink?: boolean;
  noColors?: boolean;
}

const MetadataTag = ({ data, addressHash, isLoading, noLink, noColors, ...rest }: Props) => {
  const multichainContext = useMultichainContext();

  const linkParams = !noLink ? getTagLinkParams(data, multichainContext) : undefined;
  const hasLink = Boolean(linkParams);
  const iconColor = (!noColors && data.meta?.textColor) || 'icon.secondary';

  const handleLinkClick = React.useCallback(() => {
    if (!linkParams?.href) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
      Type: 'Address tag',
      Info: data.slug,
      URL: linkParams.href,
    });
  }, [ linkParams?.href, data.slug ]);

  if (isLoading) {
    return <Skeleton loading borderRadius="sm" w="100px" h="24px"/>;
  }

  const text = (() => {
    if (data.meta?.warpcastHandle) {
      return `@${ data.meta.warpcastHandle }`;
    }

    return getTagName(data, addressHash);
  })();

  return (
    <MetadataTagTooltip data={ data }>
      <Link
        external={ linkParams?.type === 'external' }
        href={ linkParams?.href }
        onClick={ handleLinkClick }
        noIcon
        cursor={ hasLink ? 'pointer' : 'default' }
        { ...rest }
      >
        <Tag
          bg={ !noColors ? data.meta?.bgColor : undefined }
          color={ !noColors ? data.meta?.textColor : undefined }
          startElement={ <MetadataTagIcon data={ data } noColors={ noColors }/> }
          truncated
          endElement={ linkParams?.type === 'external' ? <LinkExternalIcon color={ iconColor }/> : null }
          endElementProps={ linkParams?.type === 'external' ? { ml: -1 } : undefined }
          _hover={ hasLink ? { opacity: 0.76 } : undefined }
          variant={ hasLink ? 'clickable' : 'subtle' }
        >
          { text }
        </Tag>
      </Link>
    </MetadataTagTooltip>
  );
};

export default React.memo(MetadataTag);
