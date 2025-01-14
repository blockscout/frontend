import type { ButtonProps } from '@chakra-ui/react';
import { IconButton as ChakraIconButton, useRecipe } from '@chakra-ui/react';
import * as React from 'react';
import { LuX } from 'react-icons/lu';

import { recipe as closeButtonRecipe } from '../theme/recipes/close-button.recipe';

export interface CloseButtonProps extends Omit<ButtonProps, 'visual' | 'size'> {
  visual?: 'plain';
  size?: 'md';
}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  const recipe = useRecipe({ recipe: closeButtonRecipe });
  const [ recipeProps, restProps ] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  return (
    <ChakraIconButton aria-label="Close" ref={ ref } css={ styles } { ...restProps }>
      { props.children ?? <LuX/> }
    </ChakraIconButton>
  );
});
