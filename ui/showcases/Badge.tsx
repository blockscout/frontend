import { Box } from '@chakra-ui/react';
import React from 'react';

import { Badge } from 'toolkit/chakra/badge';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const BadgeShowcase = () => {
  return (
    <Container value="badge">
      <Section>
        <SectionHeader>Color palette</SectionHeader>
        <SamplesStack>
          <Sample label="colorPalette: gray">
            <Badge colorPalette="gray">Pending</Badge>
          </Sample>
          <Sample label="colorPalette: green">
            <Badge colorPalette="green">Success</Badge>
          </Sample>
          <Sample label="colorPalette: red">
            <Badge colorPalette="red">Failed</Badge>
          </Sample>
          <Sample label="colorPalette: purple">
            <Badge colorPalette="purple">Transaction</Badge>
          </Sample>
          <Sample label="colorPalette: orange">
            <Badge colorPalette="orange">Token transfer</Badge>
          </Sample>
          <Sample label="colorPalette: blue">
            <Badge colorPalette="blue">Contract call</Badge>
          </Sample>
          <Sample label="colorPalette: yellow">
            <Badge colorPalette="yellow">Blob txn</Badge>
          </Sample>
          <Sample label="colorPalette: teal">
            <Badge colorPalette="teal">Multicall</Badge>
          </Sample>
          <Sample label="colorPalette: cyan">
            <Badge colorPalette="cyan">Internal txn</Badge>
          </Sample>
          <Sample label="colorPalette: purple_alt">
            <Badge colorPalette="purple_alt">read</Badge>
          </Sample>
          <Sample label="colorPalette: blue_alt">
            <Badge colorPalette="blue_alt">write</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Loading</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <Badge colorPalette="purple" loading>Content</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: md">
            <Badge size="md">Content</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Badge variant="subtle">Content</Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Truncate</SectionHeader>
        <SamplesStack>
          <Sample label="truncated: true">
            <Box maxW="150px">
              <Badge truncated>
                Very long content that should be truncated
              </Badge>
            </Box>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Icon</SectionHeader>
        <SamplesStack>
          <Sample label="iconStart: status/success">
            <Badge startElement={ <IconSvg name="status/success" boxSize={ 2.5 }/> }>
              Content
            </Badge>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Status tag (StatusTag)</SectionSubHeader>
        <SamplesStack>
          <Sample label="status: ok">
            <StatusTag type="ok" text="Text"/>
          </Sample>
          <Sample label="status: error">
            <StatusTag type="error" text="Text"/>
          </Sample>
          <Sample label="status: pending">
            <StatusTag type="pending" text="Text"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(BadgeShowcase);
