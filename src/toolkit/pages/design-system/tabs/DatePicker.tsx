// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React from 'react';

import { DatePicker } from 'src/toolkit/chakra/date-picker';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const DatePickerShowcase = () => {

  const [ value, setValue ] = React.useState<Array<DateValue> | undefined>(undefined);

  const handleValueChange = React.useCallback((details: { value: Array<DateValue> | undefined }) => {
    setValue(details.value);
  }, [ setValue ]);

  return (
    <Container value="date-picker">
      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline">
            <DatePicker placeholder="Select date" w="300px"/>
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
    </Container>
  );
};

export default React.memo(DatePickerShowcase);
