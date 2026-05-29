// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressMetadataTagApi } from 'src/features/address-metadata/types/api';

import MetadataTagIcon from 'src/features/address-metadata/components/tag/MetadataTagIcon';
import { getTagName } from 'src/features/address-metadata/components/tag/utils';

import highlightText from 'src/shared/texts/highlight-text';

import type { TagProps } from 'src/toolkit/chakra/tag';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props extends TagProps {
  metadata: AddressMetadataTagApi;
  searchTerm: string;
  addressHash?: string;
}

const SearchResultMetadataTag = ({ metadata, searchTerm, addressHash, ...rest }: Props) => {
  const name = getTagName(metadata, addressHash);

  return (
    <Tag
      { ...rest }
      startElement={ <MetadataTagIcon data={ metadata } noColors/> }
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
    </Tag>
  );
};

export default React.memo(SearchResultMetadataTag);
