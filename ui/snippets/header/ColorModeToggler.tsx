import type { UseCheckboxProps } from '@chakra-ui/checkbox';
import { useCheckbox } from '@chakra-ui/checkbox';
import { useColorMode, useColorModeValue, Icon } from '@chakra-ui/react';
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

import moonIcon from 'icons/moon.svg';
import sunIcon from 'icons/sun.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

export interface ColorModeTogglerProps
  extends Omit<UseCheckboxProps, 'isIndeterminate'>,
  Omit<HTMLChakraProps<'label'>, keyof UseCheckboxProps>,
  ThemingProps<'Switch'> {
  trackBg?: string;
}

const ColorModeToggler = forwardRef<ColorModeTogglerProps, 'input'>((props, ref) => {
  const ownProps = omitThemingProps(props);
  const { toggleColorMode, colorMode } = useColorMode();

  const {
    state,
    getInputProps,
    getCheckboxProps,
    getRootProps,
  } = useCheckbox({ ...ownProps, isChecked: colorMode === 'light' });

  const trackBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const thumbBg = 'white';
  const transitionProps = getDefaultTransitionProps();

  const trackStyles: SystemStyleObject = React.useMemo(() => ({
    bgColor: props.trackBg || trackBg,
    width: '72px',
    height: '32px',
    borderRadius: 'full',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'space-between',
    boxSizing: 'content-box',
    cursor: 'pointer',
    ...transitionProps,
    transitionDuration: 'ultra-slow',
  }), [ props.trackBg, trackBg, transitionProps ]);

  const thumbStyles: SystemStyleObject = React.useMemo(() => ({
    bg: thumbBg,
    boxShadow: 'md',
    width: '24px',
    height: '24px',
    borderRadius: 'md',
    position: 'absolute',
    transform: state.isChecked ? 'translate(44px, 4px)' : 'translate(4px, 4px)',
    ...transitionProps,
    transitionProperty: 'background-color, transform',
    transitionDuration: 'ultra-slow',
  }), [ thumbBg, transitionProps, state.isChecked ]);

  return (
    <chakra.label
      { ...getRootProps({ onChange: toggleColorMode }) }
      display="inline-block"
      position="relative"
      verticalAlign="middle"
      lineHeight={ 0 }
    >
      <chakra.input
        { ...getInputProps({}, ref) }
        border="none"
        height="1px"
        width="1px"
        margin="1px"
        padding="0"
        overflow="hidden"
        whiteSpace="nowrap"
        position="absolute"
      />
      <chakra.div
        { ...getCheckboxProps() }
        __css={ trackStyles }
        aria-label="Toggle color mode"
      >
        <Icon
          boxSize={ 4 }
          margin={ 2 }
          zIndex="docked"
          as={ moonIcon }
          color={ useColorModeValue('blue.300', 'blackAlpha.900') }
          { ...transitionProps }
        />
        <chakra.div
          data-checked={ dataAttr(state.isChecked) }
          data-hover={ dataAttr(state.isHovered) }
          __css={ thumbStyles }
        />
        <Icon
          boxSize={ 5 }
          margin={ 1.5 }
          zIndex="docked"
          as={ sunIcon }
          color={ useColorModeValue('blackAlpha.900', 'blue.300') }
          { ...transitionProps }
        />
      </chakra.div>
    </chakra.label>
  );
});

if (__DEV__) {
  ColorModeToggler.displayName = 'ColorModeToggler';
}

export default ColorModeToggler;
