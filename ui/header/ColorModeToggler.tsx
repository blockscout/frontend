import type { UseCheckboxProps } from '@chakra-ui/checkbox';
import { useCheckbox } from '@chakra-ui/checkbox';
import type {
  SystemStyleObject,
  ThemingProps,
  HTMLChakraProps,
} from '@chakra-ui/system';
import {
  chakra,
  forwardRef,
  omitThemingProps,
} from '@chakra-ui/system';
import { dataAttr, __DEV__ } from '@chakra-ui/utils';
import * as React from 'react';
import { SunIcon } from '@chakra-ui/icons';
import { useColorMode, useColorModeValue, Icon } from '@chakra-ui/react';
import getDefaultTransitionProps from '../../theme/utils/getDefaultTransitionProps';
import moonIcon from '../../icons/moon.svg';

import styles from './ColorModeToggler.module.css';

export interface ColorModeTogglerProps
  extends Omit<UseCheckboxProps, 'isIndeterminate'>,
  Omit<HTMLChakraProps<'label'>, keyof UseCheckboxProps>,
  ThemingProps<'Switch'> {
}

export const ColorModeToggler = forwardRef<ColorModeTogglerProps, 'input'>((props, ref) => {
  const ownProps = omitThemingProps(props);
  const { toggleColorMode, colorMode } = useColorMode();

  const {
    state,
    getInputProps,
    getCheckboxProps,
    getRootProps,
  } = useCheckbox({ ...ownProps, isChecked: colorMode === 'light' });

  const trackBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const thumbBg = useColorModeValue('white', 'black');
  const transitionProps = getDefaultTransitionProps();

  const trackStyles: SystemStyleObject = React.useMemo(() => ({
    bg: trackBg,
    ...transitionProps,
    transitionDuration: '500ms',
  }), [ trackBg, transitionProps ]);

  const thumbStyles: SystemStyleObject = React.useMemo(() => ({
    bg: thumbBg,
    ...transitionProps,
    transitionProperty: 'background-color, transform',
    transitionDuration: '500ms',
  }), [ thumbBg, transitionProps ]);

  return (
    <chakra.label
      { ...getRootProps({ onChange: toggleColorMode }) }
      className={ styles.root }
    >
      <input className={ styles.input } { ...getInputProps({}, ref) }/>
      <chakra.div
        { ...getCheckboxProps() }
        className={ styles.track }
        __css={ trackStyles }
      >
        <Icon
          className={ styles.nightIcon }
          boxSize={ 4 }
          as={ moonIcon }
          color={ useColorModeValue('blue.600', 'white') }
          { ...transitionProps }
        />
        <chakra.div
          className={ styles.thumb }
          data-checked={ dataAttr(state.isChecked) }
          data-hover={ dataAttr(state.isHovered) }
          __css={ thumbStyles }
        />
        <SunIcon
          className={ styles.dayIcon }
          boxSize={ 4 }
          color={ useColorModeValue('gray.500', 'blue.600') }
          { ...transitionProps }
        />
      </chakra.div>
    </chakra.label>
  );
});

if (__DEV__) {
  ColorModeToggler.displayName = 'ColorModeToggler';
}
