import React from 'react';

import type { AddressMetadataTagApi } from 'types/api/addressMetadata';

import highlightText from 'lib/highlightText';
import type { TagProps } from 'toolkit/chakra/tag';
import { Tag } from 'toolkit/chakra/tag';
import EntityTagIcon from 'ui/shared/EntityTags/EntityTagIcon';

interface Props extends TagProps {
  metadata: AddressMetadataTagApi;
  searchTerm: string;
}

const SearchResultEntityTag = ({ metadata, searchTerm, ...rest }: Props) => {
  return (
    <Tag
      { ...rest }
      startElement={ <EntityTagIcon data={ metadata } ignoreColor/> }
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(metadata.name, searchTerm) }}/>
    </Tag>
  );
};

export default React.memo(SearchResultEntityTag);
