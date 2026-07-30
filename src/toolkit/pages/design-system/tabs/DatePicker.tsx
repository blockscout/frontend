// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { parseDate, Text } from '@chakra-ui/react';
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';
import { delay } from 'es-toolkit';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from 'src/toolkit/chakra/button';
import { DatePicker } from 'src/toolkit/chakra/date-picker';
import { toaster } from 'src/toolkit/chakra/toaster';
import { FormFieldDate } from 'src/toolkit/components/forms/fields/FormFieldDate';
import { DAY, HOUR, MINUTE, SECOND } from 'src/toolkit/utils/consts';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

interface FormFields {
  date_of_birth: Array<DateValue>;
}

const DatePickerShowcase = () => {

  const [ value, setValue ] = React.useState<Array<DateValue> | undefined>(undefined);

  const handleValueChange = React.useCallback((details: { value: Array<DateValue> | undefined }) => {
    setValue(details.value);
  }, [ setValue ]);

  const timeZone = getLocalTimeZone();

  const formApi = useForm<FormFields>({
    defaultValues: {
      date_of_birth: [],
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormFields> = React.useCallback(async(formData) => {
    await delay(SECOND);
    // eslint-disable-next-line no-console
    console.log(formData);
    toaster.success({
      title: 'Form submitted',
      description: `Selected date: ${ formData.date_of_birth.toString() }`,
    });
  }, []);

  return (
    <Container value="date-picker">
      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline">
            <DatePicker placeholder="Select date" w="300px"/>
            <DatePicker placeholder="Select date (disabled)" w="300px" value={ [ parseDate('2022-11-11') ] } disabled/>
            <DatePicker placeholder="Select date (readOnly)" w="300px" value={ [ parseDate('2022-11-11') ] } readOnly/>
            <DatePicker placeholder="Select date (invalid)" w="300px" value={ [ parseDate('2022-11-11') ] } required invalid errorText="Error"/>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Min and max date</SectionHeader>
        <SamplesStack >
          <Sample label="min: 10d ago; max: new Date()">
            <DatePicker
              w="300px"
              min={ parseAbsolute(new Date(Date.now() - 10 * DAY).toISOString(), timeZone) }
              max={ parseAbsolute(new Date().toISOString(), timeZone) }
            />
          </Sample>
          <Sample label="min: 10d ago + 1h:42m; max: Date.now()">
            <DatePicker
              w="300px"
              min={ parseAbsolute(new Date(Date.now() - 10 * DAY + HOUR + 42 * MINUTE).toISOString(), timeZone) }
              max={ parseAbsolute(new Date().toISOString(), timeZone) }
              withTime
            />
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>With time selection</SectionHeader>
        <SamplesStack >
          <Sample label="withTime: true">
            <DatePicker placeholder="Select date" w="300px" withTime onValueChange={ handleValueChange }/>
            <Text>{ value?.toString() ?? 'No value' }</Text>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Form field</SectionHeader>
        <SamplesStack >
          <Sample>
            <FormProvider { ...formApi }>
              <form noValidate onSubmit={ formApi.handleSubmit(onSubmit) }>
                <FormFieldDate<FormFields, 'date_of_birth'>
                  name="date_of_birth"
                  placeholder="Select date of birth"
                  w="400px"
                  min={ parseAbsolute(new Date(Date.now() - 10 * DAY + HOUR + 42 * MINUTE).toISOString(), timeZone) }
                  max={ parseAbsolute(new Date().toISOString(), timeZone) }
                  withTime
                  required
                />
                <Button
                  type="submit"
                  loading={ formApi.formState.isSubmitting }
                  mt={ 6 }
                >
                  Submit
                </Button>
              </form>
            </FormProvider>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(DatePickerShowcase);
