import { Alert } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

interface Props {
  tags: Array<AddressMetadataTagFormatted> | undefined;
}

const AddressMetadataAlert = ({ tags }: Props) => {
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
      mt="-4px"
      mb={ 6 }
      status={ noteTag.meta?.alertStatus ?? 'error' }
      bgColor={ noteTag.meta?.alertBgColor }
      color={ noteTag.meta?.alertTextColor }
      whiteSpace="pre-wrap"
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

export default React.memo(AddressMetadataAlert);
