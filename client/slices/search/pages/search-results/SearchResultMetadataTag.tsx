// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressMetadataTagApi } from 'client/features/address-metadata/types/api';

import MetadataTagIcon from 'client/features/address-metadata/components/tag/MetadataTagIcon';
import { getTagName } from 'client/features/address-metadata/components/tag/utils';

import highlightText from 'client/shared/text/highlight-text';

import type { TagProps } from 'toolkit/chakra/tag';
import { Tag } from 'toolkit/chakra/tag';

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
