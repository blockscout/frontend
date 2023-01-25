import { FormControl, useToken, useColorMode } from '@chakra-ui/react';
import type { Size, CSSObjectWithLabel, OptionsOrGroups, GroupBase, SingleValue, MultiValue } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import React from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import type { Option } from './types';

import { getChakraStyles } from 'ui/shared/FancySelect/utils';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  size?: Size; // we don't have styles for sm select/input with floating label yet
  options: OptionsOrGroups<Option, GroupBase<Option>>;
  placeholder: string;
  name: string;
  onChange: (newValue: SingleValue<Option> | MultiValue<Option>) => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: Merge<FieldError, FieldErrorsImpl<Option>> | undefined;
  value?: SingleValue<Option> | MultiValue<Option>;
}

const FancySelect = ({ size = 'md', options, placeholder, name, onChange, onBlur, isDisabled, isRequired, error, value }: Props) => {
  const menuZIndex = useToken('zIndices', 'dropdown');
  const { colorMode } = useColorMode();

  const styles = React.useMemo(() => ({
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: menuZIndex }),
  }), [ menuZIndex ]);

  const chakraStyles = React.useMemo(() => getChakraStyles(colorMode), [ colorMode ]);

  return (
    <FormControl
      variant="floating"
      size={ size }
      isRequired={ isRequired }
      { ...(error ? { 'aria-invalid': true } : {}) }
      { ...(isDisabled ? { 'aria-disabled': true } : {}) }
      { ...(value ? { 'data-active': true } : {}) }
    >
      <Select
        menuPortalTarget={ window.document.body }
        placeholder=""
        name={ name }
        options={ options }
        size={ size }
        styles={ styles }
        chakraStyles={ chakraStyles }
        useBasicStyles
        onChange={ onChange }
        onBlur={ onBlur }
        isDisabled={ isDisabled }
        isRequired={ isRequired }
        isInvalid={ Boolean(error) }
        value={ value }
      />
      <InputPlaceholder
        text={ placeholder }
        error={ error }
        isFancy
      />
    </FormControl>
  );
};

export default React.memo(React.forwardRef(FancySelect));
