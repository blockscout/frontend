import { FormControl, useToken, useColorMode } from '@chakra-ui/react';
import type { CSSObjectWithLabel, GroupBase, SingleValue, MultiValue, AsyncProps, Props as SelectProps } from 'chakra-react-select';
import { Select, AsyncSelect } from 'chakra-react-select';
import React from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import type { Option } from './types';

import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';
import { getChakraStyles } from 'ui/shared/forms/inputs/select/utils';

interface CommonProps {
  error?: Merge<FieldError, FieldErrorsImpl<Option>> | undefined;
  placeholderIcon?: React.ReactNode;
}

interface RegularSelectProps extends SelectProps<Option, boolean, GroupBase<Option>>, CommonProps {
  isAsync?: false;
  onChange: (newValue: SingleValue<Option> | MultiValue<Option>) => void;
}

interface AsyncSelectProps extends AsyncProps<Option, boolean, GroupBase<Option>>, CommonProps {
  isAsync: true;
  onChange: (newValue: SingleValue<Option> | MultiValue<Option>) => void;
}

export type Props = RegularSelectProps | AsyncSelectProps;

const FancySelect = (props: Props, ref: React.LegacyRef<HTMLDivElement>) => {
  const menuZIndex = useToken('zIndices', 'dropdown');
  const { colorMode } = useColorMode();

  const styles = React.useMemo(() => ({
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: menuZIndex }),
  }), [ menuZIndex ]);

  const chakraStyles = React.useMemo(() => getChakraStyles(colorMode), [ colorMode ]);

  const SelectComponent = props.isAsync ? AsyncSelect : Select;

  return (
    <FormControl
      variant="floating"
      size={ props.size || 'md' }
      isRequired={ props.isRequired }
      ref={ ref }
      { ...(props.error ? { 'aria-invalid': true } : {}) }
      { ...(props.isDisabled ? { 'aria-disabled': true } : {}) }
      { ...(props.value ? { 'data-active': true } : {}) }
    >
      <SelectComponent
        { ...props }
        size={ props.size || 'md' }
        menuPortalTarget={ window.document.body }
        placeholder=""
        styles={ styles }
        chakraStyles={ chakraStyles }
        isInvalid={ Boolean(props.error) }
        useBasicStyles
      />
      <FormInputPlaceholder
        text={ typeof props.placeholder === 'string' ? props.placeholder : '' }
        icon={ props.placeholderIcon }
        error={ props.error }
        isFancy
      />
    </FormControl>
  );
};

export default React.memo(React.forwardRef(FancySelect));
