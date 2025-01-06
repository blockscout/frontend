import type { TagProps } from '@chakra-ui/react';
import { HStack, Tag } from '@chakra-ui/react';
import React from 'react';

type Props<T extends string> = {
  items: Array<{ id: T; title: string }>;
  tagSize?: TagProps['size'];
} & (
  {
    value?: T;
    onChange: (value: T) => void;
    isMulti?: false;
  } | {
    value: Array<T>;
    onChange: (value: Array<T>) => void;
    isMulti: true;
  }
);

const TagGroupSelect = <T extends string>({ items, value, isMulti, onChange, tagSize }: Props<T>) => {
  const onItemClick = React.useCallback((event: React.SyntheticEvent) => {
    const itemValue = (event.currentTarget as HTMLDivElement).getAttribute('data-id') as T;
    if (isMulti) {
      let newValue;
      if (value.includes(itemValue)) {
        newValue = value.filter(i => i !== itemValue);
      } else {
        newValue = [ ...value, itemValue ];
      }
      onChange(newValue);
    } else {
      onChange(itemValue);
    }
  }, [ isMulti, onChange, value ]);

  return (
    <HStack>
      { items.map(item => {
        const isSelected = isMulti ? value.includes(item.id) : value === item.id;
        return (
          <Tag
            variant="select"
            key={ item.id }
            data-id={ item.id }
            data-selected={ isSelected }
            fontWeight={ 500 }
            onClick={ onItemClick }
            size={ tagSize }
            display="inline-flex"
            justifyContent="center"
          >
            { item.title }
          </Tag>
        );
      }) }
    </HStack>
  );
};

export default TagGroupSelect;
