import { Alert, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

interface Props {
  tags: Array<AddressMetadataTagFormatted> | undefined;
  className?: string;
}

const AddressMetadataAlert = ({ tags, className }: Props) => {
  const noteTags = tags?.filter(({ tagType }) => tagType === 'note').filter(({ meta }) => meta?.data);

  if (!noteTags?.length) {
    return null;
  }

  return (
    <Flex flexDir="column" gap={ 3 } className={ className }>
      { noteTags.map((noteTag) => (
        <Alert
          key={ noteTag.name }
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
          dangerouslySetInnerHTML={{ __html: noteTag.meta?.data ?? '' }}
        />
      )) }
    </Flex>
  );
};

export default React.memo(chakra(AddressMetadataAlert));
