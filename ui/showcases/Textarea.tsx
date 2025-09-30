/* eslint-disable max-len */
import { Box } from '@chakra-ui/react';
import React from 'react';

import { Field } from 'toolkit/chakra/field';
import { Textarea } from 'toolkit/chakra/textarea';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const TextareaShowcase = () => {

  return (
    <Container value="textarea">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline" w="360px">
            <Field label="Description" required floating size="2xl">
              <Textarea/>
            </Field>
            <Field label="Description" required floating size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (invalid)" required floating invalid size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (readOnly)" required floating readOnly size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (disabled)" required floating disabled size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Box bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} p={ 4 } borderRadius="base" w="100%">
              <Field label="Description" required floating size="2xl">
                <Textarea value={ TEXT }/>
              </Field>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TextareaShowcase);
