import { Button } from '@chakra-ui/react';
import React from 'react';

type Props = {
  item: {
    id: string;
    name: string;
  };
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  ref: React.RefObject<HTMLButtonElement>;
}

const CategorySecondaryItem = ({
  item,
  selectedCategory,
  onCategoryChange,
}: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const handleClick = React.useCallback(() => {
    onCategoryChange(item.id);
  }, [ onCategoryChange, item.id ]);

  return (
    <Button
      key={ item.id }
      isActive={ item.id === selectedCategory }
      variant="ghost"
      ref={ ref }
      onClick={ handleClick }
    >
      { item.name }
    </Button>
  );
};

export default React.forwardRef(CategorySecondaryItem);
