// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { TimePicker } from 'src/toolkit/chakra/time-picker';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const TimePickerShowcase = () => {

  return (
    <Container value="time-picker">
      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack >
          <Sample label="default">
            <TimePicker w="300px"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TimePickerShowcase);
