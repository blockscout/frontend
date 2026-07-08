// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra, Center } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Input } from 'src/toolkit/chakra/input';
import { InputGroup } from 'src/toolkit/chakra/input-group';
import { ClearButton } from 'src/toolkit/components/buttons/ClearButton';

const nameServicesFeature = config.features.nameServices;

const DEFAULT_BORDER_COLOR = { _light: 'blackAlpha.100', _dark: 'whiteAlpha.200' } as const;

interface Props extends Omit<HTMLChakraProps<'form'>, 'onChange'> {
  onChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear?: () => void;
  onFormClick?: (event: React.MouseEvent<HTMLFormElement>) => void;
  isHeroBanner?: boolean;
  isSuggestOpen?: boolean;
  value?: string;
  readOnly?: boolean;
}

const SearchBarInput = (
  { onChange, onSubmit, isHeroBanner, isSuggestOpen, onFocus, onBlur, onHide, onClear, onFormClick, value, readOnly, ...rest }: Props,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const innerRef = React.useRef<HTMLFormElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLFormElement, []);
  const isMobile = useIsMobile();

  const inputConfig = isHeroBanner ? config.slices.home.heroBanner?.search : undefined;
  const defaultBorderWidth = isHeroBanner ? '0px' : '2px';

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  }, [ onChange ]);

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (isMobile) {
      return;
    }

    switch (event.key) {
      case '/': {
        if ([ 'INPUT', 'TEXTAREA' ].includes((event.target as HTMLElement).tagName)) {
          break;
        }

        if (!isSuggestOpen) {
          event.preventDefault();
          innerRef.current?.querySelector('input')?.focus();
          onFocus?.();
        }
        break;
      }
      case 'Escape': {
        if (isSuggestOpen) {
          innerRef.current?.querySelector('input')?.blur();
          onHide?.();
        }
        break;
      }
    }
  }, [ isMobile, isSuggestOpen, onFocus, onHide ]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ handleKeyPress ]);

  const getPlaceholder = () => {
    const clusterText = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? ' / cluster ' : '';
    return `Search by address / txn hash / block / token${ clusterText }/... `;
  };

  const startElement = (
    <SpriteIcon
      name="search"
      boxSize={ 5 }
      mx={ 2 }
    />
  );

  const endElement = (
    <>
      <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } mx={ 2 }/>
      { !isMobile && (
        <Center
          boxSize="20px"
          mr={ 2 }
          borderRadius="sm"
          borderWidth="1px"
          borderColor="input.element"
        >
          /
        </Center>
      ) }
    </>
  );

  return (
    <chakra.form
      ref={ innerRef }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      onClick={ onFormClick }
      w="100%"
      backgroundColor="bg.primary"
      borderRadius="base"
      position="relative"
      zIndex={ isSuggestOpen ? 'modal' : 'auto' }
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        endElement={ endElement }
      >
        <Input
          size={{ base: isHeroBanner ? 'md' : 'sm', lg: 'md' }}
          placeholder={ getPlaceholder() }
          value={ value }
          onChange={ handleChange }
          onFocus={ onFocus }
          tabIndex={ readOnly ? -1 : 0 }
          borderWidth={{
            _light: inputConfig?.border_width?.[0] ?? defaultBorderWidth,
            _dark: inputConfig?.border_width?.[1] ?? inputConfig?.border_width?.[0] ?? defaultBorderWidth,
          }}
          borderStyle="solid"
          borderColor={{
            _light: inputConfig?.border_color?._filled?.[0] ?? DEFAULT_BORDER_COLOR._light,
            _dark: inputConfig?.border_color?._filled?.[1] ?? inputConfig?.border_color?._filled?.[0] ?? DEFAULT_BORDER_COLOR._dark,
          }}
          color={{ _light: 'black', _dark: 'white' }}
          backgroundColor={
            isHeroBanner ?
              ({
                _light: inputConfig?.background?.[0] ?? 'input.bg',
                _dark: inputConfig?.background?.[1] ?? inputConfig?.background?.[0] ?? 'input.bg',
              }) :
              { base: 'dialog.bg', lg: 'input.bg' }
          }
          _placeholderShown={{
            borderColor: {
              _light: inputConfig?.border_color?._empty?.[0] ?? DEFAULT_BORDER_COLOR._light,
              _dark: inputConfig?.border_color?._empty?.[1] ?? inputConfig?.border_color?._empty?.[0] ?? DEFAULT_BORDER_COLOR._dark,
            },
          }}
          _hover={{
            borderColor: {
              _light: inputConfig?.border_color?._hover?.[0] ?? 'input.border.hover',
              _dark: inputConfig?.border_color?._hover?.[1] ?? inputConfig?.border_color?._hover?.[0] ?? 'input.border.hover',
            },
          }}
          _focusWithin={{
            _placeholder: { color: 'gray.300' },
            borderColor: {
              _light: inputConfig?.border_color?._focus?.[0] ?? 'input.border.focus',
              _dark: inputConfig?.border_color?._focus?.[1] ?? inputConfig?.border_color?._focus?.[0] ?? 'input.border.focus',
            },
            _hover: {
              borderColor: {
                _light: inputConfig?.border_color?._focus?.[0] ?? 'input.border.focus',
                _dark: inputConfig?.border_color?._focus?.[1] ?? inputConfig?.border_color?._focus?.[0] ?? 'input.border.focus',
              },
            },
          }}
          enterKeyHint="search"
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
