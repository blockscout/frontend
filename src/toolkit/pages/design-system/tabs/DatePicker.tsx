// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { parseAbsolute } from '@internationalized/date';
import React from 'react';

import { DatePicker } from 'src/toolkit/chakra/date-picker';
import { DAY, HOUR, MINUTE } from 'src/toolkit/utils/consts';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const DatePickerShowcase = () => {

  const [ value, setValue ] = React.useState<Array<DateValue> | undefined>(undefined);

  const handleValueChange = React.useCallback((details: { value: Array<DateValue> | undefined }) => {
    setValue(details.value);
  }, [ setValue ]);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    </Container>
  );
};

export default React.memo(DatePickerShowcase);
