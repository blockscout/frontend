import React from 'react';

import * as addressMetadataMock from 'mocks/metadata/address';
import { Tag } from 'toolkit/chakra/tag';
import EntityTag from 'ui/shared/EntityTags/EntityTag';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const TagsShowcase = () => {
  // TODO @tom2drum filtered tags
  return (
    <Container value="tags">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Tag>My tag</Tag>
          </Sample>
          <Sample label="variant: clickable">
            <Tag variant="clickable">My tag</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Truncated</SectionHeader>
        <SamplesStack>
          <Sample label="truncated: true">
            <Tag maxW="150px" truncated>Very very very very very looooooonggggg text</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Loading</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <Tag loading>My tag</Tag>
            <Tag maxW="150px" truncated loading>Very very very very very looooooonggggg text</Tag>
          </Sample>
          <Sample label="loading: false">
            <Tag>My tag</Tag>
            <Tag maxW="150px" truncated>Very very very very very looooooonggggg text</Tag>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Public tags</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <EntityTag data={ addressMetadataMock.nameTag }/>
            <EntityTag data={ addressMetadataMock.customNameTag }/>
            <EntityTag data={ addressMetadataMock.warpcastTag }/>
            <EntityTag data={ addressMetadataMock.genericTag }/>
            <EntityTag data={ addressMetadataMock.protocolTag }/>
            <EntityTag data={ addressMetadataMock.infoTagWithLink } maxW="150px"/>
            <EntityTag data={ addressMetadataMock.tagWithTooltip }/>
            <EntityTag data={ addressMetadataMock.nameTag } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Filter tags</SectionSubHeader>
        <span>TODO</span>
      </Section>
    </Container>
  );
};

export default React.memo(TagsShowcase);
