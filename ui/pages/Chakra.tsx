/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
import { HStack, Spinner, VStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Field } from 'toolkit/chakra/field';
import { Heading } from 'toolkit/chakra/heading';
import { NativeSelectField, NativeSelectRoot } from 'toolkit/chakra/native-select';
import { PinInput } from 'toolkit/chakra/pin-input';
import { ProgressCircleRing, ProgressCircleRoot } from 'toolkit/chakra/progress-circle';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Switch } from 'toolkit/chakra/switch';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
import { Textarea } from 'toolkit/chakra/textarea';
import { toaster } from 'toolkit/chakra/toaster';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';
import AccordionsShowcase from 'ui/showcases/Accordion';
import AlertShowcase from 'ui/showcases/Alert';
import BadgeShowcase from 'ui/showcases/Badge';
import ButtonShowcase from 'ui/showcases/Button';
import CheckboxShowcase from 'ui/showcases/Checkbox';
import ClipboardShowcase from 'ui/showcases/Clipboard';
import DialogShowcase from 'ui/showcases/Dialog';
import InputShowcase from 'ui/showcases/Input';
import LinkShowcase from 'ui/showcases/Link';
import MenuShowcase from 'ui/showcases/Menu';
import PaginationShowcase from 'ui/showcases/Pagination';
import RadioShowcase from 'ui/showcases/Radio';
import SelectShowcase from 'ui/showcases/Select';
import TabsShowcase from 'ui/showcases/Tabs';
import TagShowcase from 'ui/showcases/Tag';
import TooltipShowcase from 'ui/showcases/Tooltip';

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const ChakraShowcases = () => {
  const colorMode = useColorMode();
  const isMobile = useIsMobile();

  return (
    <>
      <PageTitle title="Chakra UI Showcase"/>
      <Switch onCheckedChange={ colorMode.toggleColorMode } checked={ colorMode.colorMode === 'dark' } mb={ 10 }>
        Color mode: { colorMode.colorMode }
      </Switch>

      <TabsRoot defaultValue="accordion" orientation={ isMobile ? 'horizontal' : 'vertical' }>
        <TabsList flexWrap="wrap" w="fit-content">
          <TabsTrigger value="accordion">Accordion</TabsTrigger>
          <TabsTrigger value="alert">Alert</TabsTrigger>
          <TabsTrigger value="badge">Badge</TabsTrigger>
          <TabsTrigger value="button">Button</TabsTrigger>
          <TabsTrigger value="checkbox">Checkbox</TabsTrigger>
          <TabsTrigger value="clipboard">Clipboard</TabsTrigger>
          <TabsTrigger value="dialog">Dialog</TabsTrigger>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="pagination">Pagination</TabsTrigger>
          <TabsTrigger value="radio">Radio</TabsTrigger>
          <TabsTrigger value="select">Select</TabsTrigger>
          <TabsTrigger value="tabs">Tabs</TabsTrigger>
          <TabsTrigger value="tag">Tag</TabsTrigger>
          <TabsTrigger value="tooltip">Tooltip</TabsTrigger>
          <TabsTrigger value="unsorted">Unsorted</TabsTrigger>
        </TabsList>
        <AccordionsShowcase/>
        <AlertShowcase/>
        <BadgeShowcase/>
        <ButtonShowcase/>
        <CheckboxShowcase/>
        <ClipboardShowcase/>
        <DialogShowcase/>
        <InputShowcase/>
        <LinkShowcase/>
        <MenuShowcase/>
        <PaginationShowcase/>
        <RadioShowcase/>
        <SelectShowcase/>
        <TabsShowcase/>
        <TagShowcase/>
        <TooltipShowcase/>

        <TabsContent value="unsorted">
          <VStack align="flex-start" gap={ 6 }>
            <section>
              <Heading textStyle="heading.sm" mb={ 2 } mt={ 6 }>Pin input</Heading>
              <HStack mt={ 4 }>
                <PinInput otp count={ 3 }/>
                <PinInput otp count={ 3 } value={ [ '1', '2', '3' ] } disabled bgColor="dialog.bg"/>
              </HStack>
            </section>

            <section>
              <Heading textStyle="heading.md" mb={ 2 }>Textarea</Heading>
              <HStack gap={ 4 } flexWrap="wrap">
                <Field label="Description" required floating size="2xl" w="360px">
                  <Textarea/>
                </Field>
                <Field label="Description" required floating size="2xl" w="360px">
                  <Textarea value={ TEXT }/>
                </Field>
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
                <Spinner/>
              </HStack>
            </section>

            <section>
              <Heading textStyle="heading.md" mb={ 2 }>Toasts</Heading>
              <HStack gap={ 4 } whiteSpace="nowrap">
                <Button onClick={ () => toaster.success({ title: 'Success', description: 'Toast content' }) }>Success</Button>
              </HStack>
            </section>

            <section>
              <Heading textStyle="heading.md" mb={ 2 }>Select</Heading>
              <HStack gap={ 4 } whiteSpace="nowrap" flexWrap="wrap">
                <NativeSelectRoot w="350px">
                  <NativeSelectField>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </HStack>
            </section>
          </VStack>
        </TabsContent>
      </TabsRoot>
    </>
  );
};

export default React.memo(ChakraShowcases);
