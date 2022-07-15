import type { UseCheckboxProps } from '@chakra-ui/checkbox';
import { useCheckbox } from '@chakra-ui/checkbox'
import type {
  SystemStyleObject,
  ThemingProps,
  HTMLChakraProps,
} from '@chakra-ui/system';
import {
  chakra,
  forwardRef,
  omitThemingProps,
} from '@chakra-ui/system'
import { dataAttr, __DEV__ } from '@chakra-ui/utils'
import * as React from 'react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

import styles from './ColorModeToggler.module.css';

const TRANSITION_DURATION = 150;

export interface ColorModeTogglerProps
  extends Omit<UseCheckboxProps, 'isIndeterminate'>,
  Omit<HTMLChakraProps<'label'>, keyof UseCheckboxProps>,
  ThemingProps<'Switch'> {
}

export const ColorModeToggler = forwardRef<ColorModeTogglerProps, 'input'>((props, ref) => {
  const ownProps = omitThemingProps(props);
  const { toggleColorMode, colorMode } = useColorMode();
  const [ isOn, setMode ] = React.useState(colorMode === 'light');

  const {
    state,
    getInputProps,
    getCheckboxProps,
    getRootProps,
  } = useCheckbox(ownProps);

  const trackBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const thumbBg = useColorModeValue('white', 'black')

  const trackStyles: SystemStyleObject = React.useMemo(() => ({
    bg: trackBg,
  }), [ trackBg ])

  const thumbStyles: SystemStyleObject = React.useMemo(() => ({
    bg: thumbBg,
    transitionProperty: 'transform',
    transitionDuration: `${ TRANSITION_DURATION }ms`,
  }), [ thumbBg ])

  const handleInputChange = React.useCallback(() => {
    // was not able to make transition while consuming flag value from chakra's useColorMode hook
    // that's why there is a local state for toggler and this fancy window.setTimeout
    setMode((isOn) => !isOn);
    window.setTimeout(toggleColorMode, TRANSITION_DURATION);
  }, [ toggleColorMode ]);

  return (
    <chakra.label
      { ...getRootProps({ onChange: handleInputChange }) }
      className={ styles.root }
    >
      <input className={ styles.input } { ...getInputProps({}, ref) }/>
      <chakra.div
        { ...getCheckboxProps() }
        className={ styles.track }
        __css={ trackStyles }
      >
        <MoonIcon className={ styles.nightIcon } boxSize={ 4 } color={ useColorModeValue('blue.600', 'white') }/>
        <chakra.div
          className={ styles.thumb }
          data-checked={ dataAttr(isOn) }
          data-hover={ dataAttr(state.isHovered) }
          __css={ thumbStyles }
        />
        <SunIcon className={ styles.dayIcon } boxSize={ 4 } color={ useColorModeValue('gray.500', 'blue.600') }/>
      </chakra.div>
    </chakra.label>
  )
})

if (__DEV__) {
  ColorModeToggler.displayName = 'ColorModeToggler'
}
