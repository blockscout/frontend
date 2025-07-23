import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra, Center } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';
interface Props extends Omit<HTMLChakraProps<'form'>, 'onChange'> {
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear: () => void;
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

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!readOnly) {
      onChange(event.target.value);
    }
  }, [ onChange, readOnly ]);

  const handleFocus = React.useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (readOnly) {
      event.target.blur();
      return;
    }
    onFocus?.();
  }, [ onFocus, readOnly ]);

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

  const startElement = (
    <IconSvg
      name="search"
      boxSize={ 5 }
      mx={ 2 }
    />
  );

  const endElement = (
    <>
      <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } mx={ 2 } color="input.placeholder"/>
      { !isMobile && (
        <Center
          boxSize="20px"
          mr={ 2 }
          borderRadius="sm"
          borderWidth="1px"
          borderColor="gray.500"
          color="gray.500"
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
      backgroundColor={{ _light: 'white', _dark: 'black' }}
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
          size="md"
          placeholder="Search by address / txn hash / block / token..."
          value={ value }
          onChange={ handleChange }
          onFocus={ handleFocus }
          border={ isHeroBanner ? 'none' : '2px solid' }
          borderColor="input.border"
          color={{ _light: 'black', _dark: 'white' }}
          _placeholder={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          _hover={{ borderColor: 'input.border.hover' }}
          _focusWithin={{ _placeholder: { color: 'gray.300' }, borderColor: 'input.border.focus', _hover: { borderColor: 'input.border.focus' } }}
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
