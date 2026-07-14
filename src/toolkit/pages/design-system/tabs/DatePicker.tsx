// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { DatePicker } from 'src/toolkit/chakra/date-picker';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const DatePickerShowcase = () => {

  return (
    <Container value="date-picker">
      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack >
          <Sample label="outline">
            <DatePicker placeholder="Select date" w="300px"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(DatePickerShowcase);
