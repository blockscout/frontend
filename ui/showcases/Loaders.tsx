import { Spinner } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ContentLoader from 'ui/shared/ContentLoader';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const LoadersShowcase = () => {

  return (
    <Container value="loaders">
      <Section>
        <SectionHeader>Skeleton</SectionHeader>
        <SamplesStack >
          <Sample>
            <Skeleton loading>
              <span>Skeleton</span>
            </Skeleton>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Content loader</SectionHeader>
        <SamplesStack >
          <Sample>
            <ContentLoader/>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Spinner</SectionHeader>
        <SectionSubHeader>Sizes</SectionSubHeader>
        <SamplesStack>
          { ([ 'xs', 'sm', 'md', 'lg', 'xl' ] as const).map((size) => (
            <Sample key={ size } label={ `size: ${ size }` }>
              <Spinner size={ size }/>
            </Sample>
          )) }
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(LoadersShowcase);
