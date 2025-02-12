import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { Checkbox } from 'toolkit/chakra/checkbox';
import { Link } from 'toolkit/chakra/link';
import { PopoverContent, PopoverRoot, PopoverTrigger, PopoverBody } from 'toolkit/chakra/popover';
import { BACKGROUND_DEFAULT } from 'ui/home/HeroBanner';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

// ?? buttons on marketplace card
const ButtonShowcase = () => {
  return (
    <Container value="button">
      <Section>
        <SectionHeader>Size</SectionHeader>
        <SamplesStack>
          <Sample label="size: xs">
            <Button size="xs">Content</Button>
          </Sample>
          <Sample label="size: sm">
            <Button size="sm">Content</Button>
          </Sample>
          <Sample label="size: md">
            <Button size="md">Content</Button>
          </Sample>
          <Sample label="size: lg">
            <Button size="lg">Content</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack>

          <Sample label="variant: solid">
            <Button variant="solid">Default</Button>
            <Button variant="solid" data-hover>Hovered</Button>
            <Button variant="solid" disabled>Disabled</Button>
          </Sample>

          <Sample label="variant: outline">
            <Button variant="outline">Default</Button>
            <Button variant="outline" data-hover>Hovered</Button>
            <Button variant="outline" disabled>Disabled</Button>
          </Sample>

          <Sample label="variant: link">
            <Button variant="link">Default</Button>
            <Button variant="link" data-hover>Hovered</Button>
            <Button variant="link" disabled>Disabled</Button>
          </Sample>

          <Sample label="variant: dropdown">
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown">Default</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  Popover content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" data-hover>Hovered</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  Popover content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" expanded>Expended</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  Popover content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="dropdown" selected>Selected</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody display="flex" flexDirection="column" gap={ 2 }>
                  <Checkbox defaultChecked>First option</Checkbox>
                  <Checkbox>Second option</Checkbox>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <Button variant="dropdown" disabled>Disabled</Button>
          </Sample>

          <Sample label="variant: header">
            <Button variant="header">Default</Button>
            <Button variant="header" data-hover>Hovered</Button>
            <Button variant="header" loading loadingText="Loading">Loading</Button>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected>Selected</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  User profile menu content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected expanded>Selected & expended</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  User profile menu content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="header" selected highlighted>Selected & highlighted</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  User profile menu content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>

          <Sample label="variant: hero" p={ 6 } background={ BACKGROUND_DEFAULT }>
            <Button variant="hero">Default</Button>
            <Button variant="hero" data-hover>Hovered</Button>
            <Button variant="hero" loading loadingText="Loading">Loading</Button>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="hero" selected>Selected</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  User profile menu content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            <PopoverRoot>
              <PopoverTrigger>
                <Button variant="hero" selected expanded>Selected & expended</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  User profile menu content
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Sample>

          <Sample label="variant: subtle">
            <Button variant="subtle" size="xs">Default: Now+1h</Button>
            <Button variant="subtle" size="xs" data-hover>Hovered: Now+1h</Button>
            <Button variant="subtle" size="xs" disabled>Disabled: Now+1h</Button>
          </Sample>

          <Sample label="variant: plain">
            <Button variant="plain">Default</Button>
            <Button variant="plain" data-hover>Hovered</Button>
            <Button variant="plain" disabled>Disabled</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Loading</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true, loadingText: 'Loading'">
            <Button loading loadingText="Loading">Content</Button>
          </Sample>
          <Sample label="loading: true, loadingText: undefined">
            <Button loading>Content</Button>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>As Link</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Link href="/" asChild>
              <Button>I am link</Button>
            </Link>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ButtonShowcase);
