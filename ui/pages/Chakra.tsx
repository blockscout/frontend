/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
import { Heading, HStack, Link, Tabs, VStack } from '@chakra-ui/react';
import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';
import { ProgressCircleRing, ProgressCircleRoot } from 'toolkit/chakra/progress-circle';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Switch } from 'toolkit/chakra/switch';
import { Textarea } from 'toolkit/chakra/textarea';
import { toaster } from 'toolkit/chakra/toaster';
import { Tooltip } from 'toolkit/chakra/tooltip';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const ChakraShowcases = () => {
  const colorMode = useColorMode();

  return (
    <>
      <PageTitle title="Chakra UI Showcase"/>
      <Switch onCheckedChange={ colorMode.toggleColorMode } checked={ colorMode.colorMode === 'dark' } mb={ 10 }>
        Color mode: { colorMode.colorMode }
      </Switch>

      <VStack align="flex-start" gap={ 6 }>
        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Buttons</Heading>
          <HStack gap={ 4 } flexWrap="wrap">
            <Button>Solid</Button>
            <Button visual="outline">Outline</Button>
            <Button visual="dropdown">Dropdown</Button>
            <Button visual="dropdown" selected>Dropdown selected</Button>
            <Button visual="header">Header</Button>
            <Button visual="header" selected>Header selected</Button>
            <Button visual="header" selected highlighted>Header highlighted</Button>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Inputs</Heading>
          <Heading textStyle="heading.sm" mb={ 2 }>Regular</Heading>
          <HStack gap={ 4 } whiteSpace="nowrap">
            <Field label="Email" required>
              <Input type="email"/>
            </Field>
            <Field label="Email">
              <Input value="me@example.com"/>
            </Field>
            <Field label="Email" invalid>
              <Input value="duck"/>
            </Field>
            <Field label="Email" readOnly>
              <Input value="duck"/>
            </Field>
            <Field label="Email" disabled>
              <Input value="duck"/>
            </Field>
          </HStack>
          <HStack gap={ 4 } whiteSpace="nowrap" mt={ 4 } alignItems="flex-start">
            <Field label="Email" required size="sm">
              <Input/>
            </Field>
            <Field label="Email" required size="md">
              <Input/>
            </Field>
            <Field label="Email" required size="lg">
              <Input/>
            </Field>
            <Field label="Email" required size="xl">
              <Input/>
            </Field>
          </HStack>
          <Heading textStyle="heading.sm" mb={ 2 } mt={ 6 }>Floating (only XL size)</Heading>
          <HStack gap={ 4 } mt={ 4 } alignItems="flex-start">
            <Field label="Email" required floating size="xl" w="300px">
              <Input type="email"/>
            </Field>
            <Field label="Email" required floating invalid errorText="Something went wrong" size="xl" w="300px">
              <Input type="email"/>
            </Field>
          </HStack>
          <HStack p={ 6 } mt={ 4 } gap={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} >
            <Field label="Email" required floating size="xl" w="300px">
              <Input type="email"/>
            </Field>
            <Field label="Email" required floating disabled size="xl" w="300px">
              <Input type="email" value="me@example.com"/>
            </Field>
            <Field label="Email" required floating readOnly size="xl" w="300px">
              <Input type="email" value="me@example.com"/>
            </Field>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Textarea</Heading>
          <HStack gap={ 4 }>
            <Field label="Description" required floating size="xxl" w="400px">
              <Textarea/>
            </Field>
            <Field label="Description" required floating size="xxl" w="400px">
              <Textarea value={ TEXT }/>
            </Field>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Links</Heading>
          <HStack gap={ 4 }>
            <Link>Primary</Link>
            <Link visual="secondary">Secondary</Link>
            <Link visual="subtle">Subtle</Link>
            <Link visual="navigation">Navigation</Link>
            <Link visual="navigation" data-selected p={ 3 } borderRadius="base">Navigation selected</Link>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Tooltips</Heading>
          <HStack gap={ 4 }>
            <Tooltip content="Tooltip content">
              <span>Default</span>
            </Tooltip>
            <Tooltip content="Tooltip content" visual="navigation">
              <span>Navigation</span>
            </Tooltip>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Progress Circle</Heading>
          <HStack gap={ 4 }>
            <ProgressCircleRoot
              value={ 45 }
              colorPalette="blue"
            >
              <ProgressCircleRing/>
            </ProgressCircleRoot>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Skeleton & Loaders</Heading>
          <HStack gap={ 4 }>
            <Skeleton loading>
              <span>Skeleton</span>
            </Skeleton>
            <ContentLoader/>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Tabs</Heading>
          <HStack gap={ 4 }>
            <Tabs.Root defaultValue="tab1" variant="solid">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
              <Tabs.Content value="tab2">Content 2</Tabs.Content>
            </Tabs.Root>
            <Tabs.Root defaultValue="tab1" variant="secondary" size="sm">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
              <Tabs.Content value="tab2">Content 2</Tabs.Content>
            </Tabs.Root>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Alerts</Heading>
          <HStack gap={ 4 } whiteSpace="nowrap">
            <Alert visual="info" title="Info"> Alert content </Alert>
            <Alert visual="neutral" title="Neutral"> Alert content </Alert>
            <Alert visual="warning" title="Warning"> Alert content </Alert>
            <Alert visual="success" title="Success"> Alert content </Alert>
            <Alert visual="error" title="Error" startElement={ null }> Alert content </Alert>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Toasts</Heading>
          <HStack gap={ 4 } whiteSpace="nowrap">
            <Button onClick={ () => toaster.success({ title: 'Success', description: 'Toast content' }) }>Success</Button>
          </HStack>
        </section>
      </VStack>
    </>
  );
};

export default React.memo(ChakraShowcases);
