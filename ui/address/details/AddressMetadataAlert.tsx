import { Alert, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

interface Props {
  tags: Array<AddressMetadataTagFormatted> | undefined;
  className?: string;
}

const AddressMetadataAlert = ({ tags, className }: Props) => {
  const noteTag = tags?.find(({ tagType }) => tagType === 'note');
  if (!noteTag) {
    return null;
  }

  const content = noteTag.meta?.data;

  if (!content) {
    return null;
  }

  return (
    <Alert
      className={ className }
      status={ noteTag.meta?.alertStatus ?? 'error' }
      bgColor={ noteTag.meta?.alertBgColor }
      color={ noteTag.meta?.alertTextColor }
      whiteSpace="pre-wrap"
      display="inline-block"
      sx={{
        '& a': {
          color: 'link',
          _hover: {
            color: 'link_hovered',
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default React.memo(chakra(AddressMetadataAlert));
