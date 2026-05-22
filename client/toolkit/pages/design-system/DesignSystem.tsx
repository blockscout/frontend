// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import { useColorMode } from 'toolkit/chakra/color-mode';
import { Switch } from 'toolkit/chakra/switch';
import { TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
import PageTitle from 'ui/shared/Page/PageTitle';

import AccordionsShowcase from './tabs/Accordion';
import AlertShowcase from './tabs/Alert';
import BadgeShowcase from './tabs/Badge';
import ButtonShowcase from './tabs/Button';
import CheckboxShowcase from './tabs/Checkbox';
import ClipboardShowcase from './tabs/Clipboard';
import CloseButtonShowcase from './tabs/CloseButton';
import CollapsibleShowcase from './tabs/Collapsible';
import ContentLoaderShowcase from './tabs/ContentLoader';
import DialogShowcase from './tabs/Dialog';
import EmptyStateShowcase from './tabs/EmptyState';
import FieldShowcase from './tabs/Field';
import IconButtonShowcase from './tabs/IconButton';
import InputShowcase from './tabs/Input';
import LinkShowcase from './tabs/Link';
import MenuShowcase from './tabs/Menu';
import PaginationShowcase from './tabs/Pagination';
import PinInputShowcase from './tabs/PinInput';
import PopoverShowcase from './tabs/Popover';
import ProgressShowcase from './tabs/Progress';
import ProgressCircleShowcase from './tabs/ProgressCircle';
import RadioShowcase from './tabs/Radio';
import RatingShowcase from './tabs/Rating';
import SelectShowcase from './tabs/Select';
import SkeletonShowcase from './tabs/Skeleton';
import SpinnerShowcase from './tabs/Spinner';
import StatusShowcase from './tabs/Status';
import SwitchShowcase from './tabs/Switch';
import TableShowcase from './tabs/Table';
import TabsShowcase from './tabs/Tabs';
import TagShowcase from './tabs/Tag';
import TextareaShowcase from './tabs/Textarea';
import ToastShowcase from './tabs/Toast';
import TooltipShowcase from './tabs/Tooltip';
import ValuesShowcase from './tabs/Values';

const tabs = [
  { label: 'Accordion', value: 'accordion', component: <AccordionsShowcase/> },
  { label: 'Alert', value: 'alert', component: <AlertShowcase/> },
  { label: 'Badge', value: 'badge', component: <BadgeShowcase/> },
  { label: 'Button', value: 'button', component: <ButtonShowcase/> },
  { label: 'Checkbox', value: 'checkbox', component: <CheckboxShowcase/> },
  { label: 'Clipboard', value: 'clipboard', component: <ClipboardShowcase/> },
  { label: 'Close button', value: 'close-button', component: <CloseButtonShowcase/> },
  { label: 'Collapsible', value: 'collapsible', component: <CollapsibleShowcase/> },
  { label: 'Content loader', value: 'content-loader', component: <ContentLoaderShowcase/> },
  { label: 'Dialog', value: 'dialog', component: <DialogShowcase/> },
  { label: 'Empty state', value: 'empty-state', component: <EmptyStateShowcase/> },
  { label: 'Field', value: 'field', component: <FieldShowcase/> },
  { label: 'Icon button', value: 'icon-button', component: <IconButtonShowcase/> },
  { label: 'Input', value: 'input', component: <InputShowcase/> },
  { label: 'Link', value: 'link', component: <LinkShowcase/> },
  { label: 'Menu', value: 'menu', component: <MenuShowcase/> },
  { label: 'Pagination', value: 'pagination', component: <PaginationShowcase/> },
  { label: 'Progress', value: 'progress', component: <ProgressShowcase/> },
  { label: 'Progress Circle', value: 'progress-circle', component: <ProgressCircleShowcase/> },
  { label: 'Radio', value: 'radio', component: <RadioShowcase/> },
  { label: 'Rating', value: 'rating', component: <RatingShowcase/> },
  { label: 'Pin input', value: 'pin-input', component: <PinInputShowcase/> },
  { label: 'Popover', value: 'popover', component: <PopoverShowcase/> },
  { label: 'Select', value: 'select', component: <SelectShowcase/> },
  { label: 'Skeleton', value: 'skeleton', component: <SkeletonShowcase/> },
  { label: 'Spinner', value: 'spinner', component: <SpinnerShowcase/> },
  { label: 'Status', value: 'status', component: <StatusShowcase/> },
  { label: 'Switch', value: 'switch', component: <SwitchShowcase/> },
  { label: 'Table', value: 'table', component: <TableShowcase/> },
  { label: 'Tabs', value: 'tabs', component: <TabsShowcase/> },
  { label: 'Tag', value: 'tag', component: <TagShowcase/> },
  { label: 'Textarea', value: 'textarea', component: <TextareaShowcase/> },
  { label: 'Toast', value: 'toast', component: <ToastShowcase/> },
  { label: 'Tooltip', value: 'tooltip', component: <TooltipShowcase/> },
  { label: 'Values', value: 'values', component: <ValuesShowcase/> },
];

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
        <TabsList flexWrap="wrap" w="fit-content" whiteSpace="nowrap">
          { tabs.map((tab) => (
            <TabsTrigger key={ tab.value } value={ tab.value }>{ tab.label }</TabsTrigger>
          )) }
        </TabsList>
        { tabs.map((tab) => <React.Fragment key={ tab.value }>{ tab.component }</React.Fragment>) }
      </TabsRoot>
    </>
  );
};

export default React.memo(ChakraShowcases);
