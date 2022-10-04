import { Button, visuallyHiddenStyle } from '@chakra-ui/react';
import React, { useCallback } from 'react';

type Props = {
  item: {
    id: string;
    name: string;
  };
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  ref: React.RefObject<HTMLButtonElement>;
  isVisible: boolean;
}

const CategoryPrimaryItem = ({ item, selectedCategory, onCategoryChange, isVisible }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const handleClick = useCallback(() => {
    onCategoryChange(item.id);
  }, [ item.id, onCategoryChange ]);

  return (
    <Button
      key={ item.id }
      isActive={ item.id === selectedCategory }
      variant="ghost"
      ref={ ref }
      fontSize="28px"
      scrollSnapAlign="start"
      onClick={ handleClick }
      { ...(isVisible ? {} : { __css: visuallyHiddenStyle }) }
    >
      { item.name }
    </Button>
  );
};

export default React.forwardRef(CategoryPrimaryItem);
