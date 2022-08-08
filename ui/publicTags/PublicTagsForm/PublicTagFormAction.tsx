import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { Inputs } from './PublicTagsForm';

interface Props {
  control: Control<Inputs>;
  canReport: boolean;
}

export default function PublicTagFormAction({ control, canReport }: Props) {
  const renderRadioGroup = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'action'>}) => {
    return (
      <RadioGroup defaultValue="add" value={ field.value } colorScheme="blue">
        <Stack spacing={ 5 }>
          <Radio value="add">
            I want to add tags for my project
          </Radio>
          <Radio value="report" isDisabled={ canReport }>
            I want to report an incorrect public tag
          </Radio>
        </Stack>
      </RadioGroup>
    );
  }, [ canReport ]);

  return (
    <Controller
      name="action"
      control={ control }
      render={ renderRadioGroup }
    />
  );
}
