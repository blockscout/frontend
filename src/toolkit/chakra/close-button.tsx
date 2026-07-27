// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ButtonProps, JsxStyleProps } from '@chakra-ui/react';
import { Icon, useRecipe } from '@chakra-ui/react';
import * as React from 'react';

import CloseIcon from 'src/sprite/icons/close.svg';

import { recipe as closeButtonRecipe } from '../theme/recipes/close-button.recipe';
import { IconButton } from './icon-button';
export interface CloseButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'plain';
  size?: 'md';
  iconProps?: JsxStyleProps;
}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  const recipe = useRecipe({ recipe: closeButtonRecipe });
  const [ recipeProps, restProps ] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);
  const { iconProps, ...rest } = restProps;

  return (
    <IconButton aria-label="Close" ref={ ref } css={ styles } { ...rest }>
      { props.children ?? <Icon boxSize={ 5 } { ...iconProps }><CloseIcon/></Icon> }
    </IconButton>
  );
});
