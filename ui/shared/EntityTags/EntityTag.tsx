import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import { Link, LinkExternalIcon } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';

import EntityTagIcon from './EntityTagIcon';
import EntityTagTooltip from './EntityTagTooltip';
import { getTagLinkParams } from './utils';

interface Props extends HTMLChakraProps<'span'> {
  data: TEntityTag;
  isLoading?: boolean;
  noLink?: boolean;
}

const EntityTag = ({ data, isLoading, noLink, ...rest }: Props) => {

  const linkParams = !noLink ? getTagLinkParams(data) : undefined;
  const hasLink = Boolean(linkParams);
  const iconColor = data.meta?.textColor ?? 'gray.400';

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

    return data.name;
  })();

  return (
    <EntityTagTooltip data={ data }>
      <Link
        external={ linkParams?.type === 'external' }
        href={ linkParams?.href }
        onClick={ handleLinkClick }
        noIcon
        cursor={ hasLink ? 'pointer' : 'default' }
        { ...rest }
      >
        <Tag
          bg={ data.meta?.bgColor }
          color={ data.meta?.textColor }
          startElement={ <EntityTagIcon data={ data }/> }
          truncated
          endElement={ linkParams?.type === 'external' ? <LinkExternalIcon color={ iconColor }/> : null }
          endElementProps={ linkParams?.type === 'external' ? { ml: -1 } : undefined }
          _hover={ hasLink ? { opacity: 0.76 } : undefined }
          variant={ hasLink ? 'clickable' : 'subtle' }
        >
          { text }
        </Tag>
      </Link>
    </EntityTagTooltip>
  );
};

export default React.memo(EntityTag);
