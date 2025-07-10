import React from 'react';

import { Switch } from 'toolkit/chakra/switch';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const SwitchShowcase = () => {

  return (
    <Container value="switch">
      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Switch size="sm">
              Show duck
            </Switch>
          </Sample>
          <Sample label="size: md">
            <Switch size="md">
              Show duck
            </Switch>
          </Sample>
          <Sample label="size: lg">
            <Switch size="lg">
              Show duck
            </Switch>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SwitchShowcase);
