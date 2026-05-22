// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { Checkbox } from 'toolkit/chakra/checkbox';
import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverTrigger, PopoverRoot } from 'toolkit/chakra/popover';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const IconButtonShowcase = () => {
  return (
    <Container value="icon-button">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: icon_secondary">
            <IconButton size="md" variant="icon_secondary">
              <SpriteIcon name="info"/>
            </IconButton>
            <IconButton size="md" variant="icon_secondary" data-hover>
              <SpriteIcon name="info"/>
            </IconButton>
            <IconButton size="md" variant="icon_secondary" disabled>
              <SpriteIcon name="info"/>
            </IconButton>
            <IconButton size="md" variant="icon_secondary" selected>
              <SpriteIcon name="info"/>
            </IconButton>
            <IconButton size="md" variant="icon_secondary" selected data-hover>
              <SpriteIcon name="info"/>
            </IconButton>
            <IconButton size="md" variant="icon_secondary" selected disabled>
              <SpriteIcon name="info"/>
            </IconButton>
          </Sample>

          <Sample label="variant: icon_background">
            <IconButton size="md" variant="icon_background">
              <SpriteIcon name="heart_outline"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" data-hover>
              <SpriteIcon name="heart_outline"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" disabled>
              <SpriteIcon name="heart_outline"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" selected>
              <SpriteIcon name="heart_filled"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" selected data-hover>
              <SpriteIcon name="heart_filled"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" selected disabled>
              <SpriteIcon name="heart_filled"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" loading>
              <SpriteIcon name="heart_filled"/>
            </IconButton>
            <IconButton size="md" variant="icon_background" loadingSkeleton>
              <SpriteIcon name="heart_filled"/>
            </IconButton>
          </Sample>

          <Sample label="variant: dropdown">
            <PopoverRoot>
              <PopoverTrigger>
                <IconButton size="md" variant="dropdown">
                  <SpriteIcon name="filter"/>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  Popover content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <IconButton size="md" variant="dropdown" expanded>
                  <SpriteIcon name="filter"/>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  Popover content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <IconButton size="md" variant="dropdown" selected>
                  <SpriteIcon name="filter"/>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody display="flex" flexDirection="column" gap={ 2 }>
                  <Checkbox defaultChecked>First option</Checkbox>
                  <Checkbox>Second option</Checkbox>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <IconButton size="md" variant="dropdown" disabled>
              <SpriteIcon name="filter"/>
            </IconButton>
            <IconButton size="md" variant="dropdown" loading>
              <SpriteIcon name="filter"/>
            </IconButton>
            <IconButton size="md" variant="dropdown" loadingSkeleton>
              <SpriteIcon name="filter"/>
            </IconButton>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: 2xs">
            <IconButton size="2xs" variant="icon_secondary" outline="1px dashed lightpink">
              <SpriteIcon name="star_outline"/>
            </IconButton>
          </Sample>
          <Sample label="size: 2xs_alt">
            <IconButton size="2xs_alt" variant="icon_secondary" outline="1px dashed lightpink">
              <SpriteIcon name="plus"/>
            </IconButton>
          </Sample>
          <Sample label="size: md">
            <IconButton size="md" variant="icon_secondary" outline="1px dashed lightpink">
              <SpriteIcon name="star_outline"/>
            </IconButton>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(IconButtonShowcase);
