import { RadioGroup, Radio, Stack } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Inputs } from './PublicTagsForm';

interface Props {
  control: Control<Inputs>;
  isDisabled?: boolean;
}

export default function PublicTagFormAction({ control, isDisabled }: Props) {
  const renderRadioGroup = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'action'>}) => {
    return (
      <RadioGroup defaultValue="add" colorScheme="blue" { ...field }>
        <Stack spacing={ 5 }>
          <Radio value="add">
            I want to add tags for my project
          </Radio>
          <Radio value="report" isDisabled={ isDisabled }>
            I want to report an incorrect public tag
          </Radio>
        </Stack>
      </RadioGroup>
    );
  }, [ isDisabled ]);

  return (
    <Controller
      name="action"
      control={ control }
      render={ renderRadioGroup }
    />
  );
}
