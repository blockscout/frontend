import React from 'react';

import { Checkbox } from 'toolkit/chakra/checkbox';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const CheckboxShowcase = () => {

  return (
    <Container value="checkbox">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Checkbox>Option 1</Checkbox>
            <Checkbox checked>Option 2</Checkbox>
            <Checkbox disabled>Option 3</Checkbox>
            <Checkbox checked disabled>Option 4</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: xs">
            <Checkbox size="xs">Option 1</Checkbox>
            <Checkbox size="xs">Option 2</Checkbox>
          </Sample>
          <Sample label="size: sm">
            <Checkbox size="sm">Option 1</Checkbox>
            <Checkbox size="sm">Option 2</Checkbox>
          </Sample>
          <Sample label="size: md">
            <Checkbox size="md">Option 1</Checkbox>
            <Checkbox size="md">Option 2</Checkbox>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(CheckboxShowcase);
