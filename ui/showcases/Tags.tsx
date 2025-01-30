import React from 'react';

import { Tag } from 'toolkit/chakra/tag';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const TagsShowcase = () => {
  return (
    <Container value="tags">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: ???">
            <Tag>My tag</Tag>
            <Tag maxW="150px" truncated>Very very very very very looooooonggggg text</Tag>
            <Tag loading>My tag</Tag>
            <Tag maxW="150px" truncated loading>Very very very very very looooooonggggg text</Tag>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TagsShowcase);
