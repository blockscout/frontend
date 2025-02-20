import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';
import IconSvg from 'ui/shared/IconSvg';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const MenuShowcase = () => {

  return (
    <Container value="menu">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton variant="dropdown" size="sm">
                  <IconSvg name="dots" boxSize="18px"/>
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="refresh-metadata">Refresh metadata</MenuItem>
                <MenuItem value="add-token-info">Add token info</MenuItem>
                <MenuItem value="add-private-tag">Add private tag</MenuItem>
                <MenuItem value="add-public-tag">Add public tag</MenuItem>
              </MenuContent>
            </MenuRoot>

            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton variant="dropdown" size="sm" loadingSkeleton>
                  <IconSvg name="dots" boxSize="18px"/>
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="refresh-metadata">Refresh metadata</MenuItem>
                <MenuItem value="add-token-info">Add token info</MenuItem>
                <MenuItem value="add-private-tag">Add private tag</MenuItem>
                <MenuItem value="add-public-tag">Add public tag</MenuItem>
              </MenuContent>
            </MenuRoot>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Example 1</SectionSubHeader>
      </Section>
    </Container>
  );
};

export default React.memo(MenuShowcase);
