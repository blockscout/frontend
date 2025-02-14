import React from 'react';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const InputShowcase = () => {
  return (
    <Container value="input">
      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: sm">
            <Input type="text" placeholder="Name" size="sm"/>
          </Sample>
          <Sample label="size: md">
            <Input type="text" placeholder="Name" size="md"/>
          </Sample>
          <Sample label="size: lg">
            <Input type="text" placeholder="Name" size="lg"/>
          </Sample>
          <Sample label="size: xl">
            <Input type="text" placeholder="Name" size="xl"/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: outline" maxW="300px">
            <Input type="text" placeholder="Name"/>
            <Input type="text" placeholder="Name (disabled)" disabled/>
            <Input type="text" placeholder="Name (readOnly)" readOnly/>
            <Input type="text" placeholder="Name (invalid)" data-invalid/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Field</SectionHeader>
        <SectionSubHeader>Size</SectionSubHeader>
        <SamplesStack>
          { ([ 'sm', 'md', 'lg' ] as const).map((size) => (
            <Sample label={ `size: ${ size }` } w="100%" key={ size } alignItems="flex-start">
              <Field label="Email" required size={ size } helperText="Helper text" maxWidth="200px">
                <Input size={ size }/>
              </Field>
              <Field label="Email (disabled)" required size={ size } maxWidth="200px">
                <Input size={ size } disabled value="me@example.com"/>
              </Field>
              <Field label="Email (readOnly)" required size={ size } maxWidth="200px">
                <Input size={ size } readOnly value="me@example.com"/>
              </Field>
              <Field label="Email (invalid)" required size={ size } errorText="Something went wrong" invalid maxWidth="200px">
                <Input size={ size } value="duck"/>
              </Field>
            </Sample>
          )) }

          <Sample label="size: xl" w="100%" alignItems="flex-start">
            <Field label="Email" required floating size="xl" helperText="Helper text" maxWidth="300px">
              <Input size="xl"/>
            </Field>
            <Field label="Email (disabled)" required floating size="xl" maxWidth="300px">
              <Input size="xl" disabled value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required floating size="xl" maxWidth="300px">
              <Input size="xl" readOnly value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required floating size="xl" errorText="Something went wrong" invalid maxWidth="300px">
              <Input size="xl" value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>On custom background</SectionSubHeader>
        <SamplesStack>
          <Sample label="no floating label" p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label="Email" required helperText="Helper text" maxWidth="200px">
              <Input/>
            </Field>
            <Field label="Email (disabled)" required maxWidth="200px">
              <Input disabled value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required maxWidth="200px">
              <Input readOnly value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required errorText="Something went wrong" invalid maxWidth="200px">
              <Input size="xl" value="duck"/>
            </Field>
          </Sample>
          <Sample label="floating label" p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label="Email" required floating size="xl" helperText="Helper text" maxWidth="300px">
              <Input size="xl"/>
            </Field>
            <Field label="Email (disabled)" required floating size="xl" maxWidth="300px">
              <Input size="xl" disabled value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required floating size="xl" maxWidth="300px">
              <Input size="xl" readOnly value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required floating size="xl" errorText="Something went wrong" invalid maxWidth="300px">
              <Input size="xl" value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Input group</SectionSubHeader>
        <SamplesStack>
          <Sample label="with end element">
            <Field label="Referral code" required floating size="xl" w="300px" flexShrink={ 0 }>
              <InputGroup endElement={ <IconSvg name="copy" boxSize={ 5 }/> }>
                <Input/>
              </InputGroup>
            </Field>
          </Sample>
          <Sample label="with start element">
            <InputGroup startElement={ <IconSvg name="collection" boxSize={ 5 }/> }>
              <Input placeholder="Type in something"/>
            </InputGroup>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Filter input</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <FilterInput placeholder="Search by method name"/>
            <FilterInput placeholder="Search by method name" loading/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(InputShowcase);
