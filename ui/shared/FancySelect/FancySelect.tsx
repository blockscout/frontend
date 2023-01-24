import { FormControl, useBoolean, useToken } from '@chakra-ui/react';
import type { Size, CSSObjectWithLabel, OptionsOrGroups, GroupBase, SingleValue, MultiValue } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import React from 'react';
import type { FieldError } from 'react-hook-form';

import type { Option } from './types';

import { chakraStyles } from 'ui/shared/FancySelect/utils';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  size?: Size;
  options: OptionsOrGroups<Option, GroupBase<Option>>;
  placeholder: string;
  name: string;
  onChange: (newValue: string) => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: FieldError;
}

const FancySelect = ({ size = 'md', options, placeholder, name, onChange, onBlur, isDisabled, isRequired, error }: Props) => {
  const [ hasValue, setHasValue ] = useBoolean(false);

  const menuZIndex = useToken('zIndices', 'dropdown');

  const handleChange = React.useCallback((newValue: SingleValue<Option> | MultiValue<Option>) => {
    if (Array.isArray(newValue)) {
      return;
    }

    const _newValue = newValue as SingleValue<Option>;
    if (!_newValue) {
      return;
    }

    setHasValue.on();
    onChange(_newValue.value);
  }, [ setHasValue, onChange ]);

  const handleBlur = React.useCallback(() => {
    onBlur?.();
  }, [ onBlur ]);

  const styles = React.useMemo(() => ({
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: menuZIndex }),
  }), [ menuZIndex ]);

  return (
    <FormControl variant="floating" size={ size } isRequired={ isRequired }>
      <Select
        menuPortalTarget={ window.document.body }
        placeholder=""
        name={ name }
        options={ options }
        size={ size }
        styles={ styles }
        chakraStyles={ chakraStyles }
        useBasicStyles
        onChange={ handleChange }
        onBlur={ handleBlur }
        isDisabled={ isDisabled }
        isRequired={ isRequired }
        isInvalid={ Boolean(error) }
      />
      <InputPlaceholder
        text={ placeholder }
        isActive={ hasValue }
        error={ error }
        isFancy
      />
    </FormControl>
  );
};

export default React.memo(FancySelect);
