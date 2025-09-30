import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import type { AlertProps } from 'toolkit/chakra/alert';
import { Alert } from 'toolkit/chakra/alert';

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
          status={ noteTag.meta?.alertStatus as AlertProps['status'] ?? 'error' }
          bgColor={ noteTag.meta?.alertBgColor }
          color={ noteTag.meta?.alertTextColor }
          whiteSpace="pre-wrap"
          display="inline-block"
          css={{
            '& a': {
              color: 'link.primary',
              _hover: {
                color: 'link.primary.hover',
              },
            },
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: noteTag.meta?.data ?? '' }}/>
        </Alert>
      )) }
    </Flex>
  );
};

export default React.memo(chakra(AddressMetadataAlert));
