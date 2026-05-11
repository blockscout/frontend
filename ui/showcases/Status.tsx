import React from 'react';

import { Status } from 'toolkit/chakra/status';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const StatusShowcase = () => {

  return (
    <Container value="status">
      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack>
          <Sample label="variant: default">
            <Status/>
            <Status borderColor="popover.bg"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: xs">
            <Status size="xs"/>
          </Sample>
          <Sample label="size: sm">
            <Status size="sm"/>
          </Sample>
          <Sample label="size: md">
            <Status size="md"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(StatusShowcase);
