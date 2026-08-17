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
            <TimePicker w="200px"/>
            <TimePicker w="200px" value="12:00" disabled/>
            <TimePicker w="200px" value="12:00" readOnly/>
            <TimePicker w="200px" value="12:00" invalid/>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Min and max time</SectionHeader>
        <SamplesStack >
          <Sample label="min: 03:45; max: 21:13">
            <TimePicker min="03:45" max="21:13" value="01:01"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TimePickerShowcase);
