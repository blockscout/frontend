// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Tag } from 'src/toolkit/chakra/tag';

export interface FilterTag<TKey extends string> {
  readonly key: TKey;
  readonly name: string;
  readonly value: string;
  readonly isLoading?: boolean;
}

interface Props<TKey extends string> extends FlexProps {
  tags: ReadonlyArray<FilterTag<TKey>>;
  onClear: (key: TKey) => void;
  onClearAll: () => void;
  leadingTags?: React.ReactNode;
  placeholderTags?: React.ReactNode;
}

const FilterTagsRow = <TKey extends string>({ tags, onClear, onClearAll, leadingTags, placeholderTags, ...rest }: Props<TKey>) => {
  const handleClear = React.useCallback((key: TKey) => () => onClear(key), [ onClear ]);

  const hasClosableTags = tags.length > 0;
  const placeholder = hasClosableTags ? null : placeholderTags;

  if (!hasClosableTags && !leadingTags && !placeholder) {
    return null;
  }

  return (
    <Flex alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={ 2 } { ...rest }>
      <Flex alignItems="center" flexWrap="wrap" gap={ 2 } minW={ 0 }>
        { leadingTags }
        { tags.map((tag) => (
          <Tag key={ tag.key } variant="filter" label={ tag.name } onClose={ handleClear(tag.key) } closable loading={ tag.isLoading }>
            { tag.value }
          </Tag>
        )) }
        { placeholder }
      </Flex>
      { hasClosableTags && (
        <Link onClick={ onClearAll } display="flex" alignItems="center" gap={ 1 } textStyle="sm" whiteSpace="nowrap">
          <SpriteIcon name="repeat" boxSize={ 5 }/>
          Reset all
        </Link>
      ) }
    </Flex>
  );
};

export default FilterTagsRow;
