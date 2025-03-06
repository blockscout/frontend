import type { ButtonProps } from '@chakra-ui/react';
import { IconButton as ChakraIconButton, useRecipe } from '@chakra-ui/react';
import * as React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import { recipe as closeButtonRecipe } from '../theme/recipes/close-button.recipe';
export interface CloseButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'plain';
  size?: 'sm' | 'md' | 'lg';
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
      { props.children ?? <IconSvg name="cross" boxSize={ 6 }/> }
    </ChakraIconButton>
  );
});
