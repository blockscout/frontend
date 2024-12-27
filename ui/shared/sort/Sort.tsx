import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { SelectOption } from 'ui/shared/select/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import Select, { type Props as SelectProps } from 'ui/shared/select/Select';

import SortButtonDesktop from './ButtonDesktop';
import SortButtonMobile from './ButtonMobile';

type Props<Value extends string> = Omit<SelectProps<Value>, 'children'>;

const Sort = <Sort extends string>({ name, options, isLoading, onChange, defaultValue }: Props<Sort>) => {
  const isMobile = useIsMobile(false);

  return (
    <Select
      options={ options }
      name={ name }
      defaultValue={ defaultValue }
      onChange={ onChange }
    >
      { ({ isOpen, onToggle, value }) => {
        return (
          isMobile ? (
            <SortButtonMobile isActive={ isOpen || Boolean(value) } onClick={ onToggle } isLoading={ isLoading }/>
          ) : (
            <SortButtonDesktop isActive={ isOpen } isLoading={ isLoading } onClick={ onToggle }>
              { options.find((option: SelectOption<Sort>) => option.value === value || (!option.value && !value))?.label }
            </SortButtonDesktop>
          )
        );
      } }
    </Select>
  );
};

export default React.memo(chakra(Sort)) as typeof Sort;
