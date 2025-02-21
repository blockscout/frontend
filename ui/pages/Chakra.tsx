import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Switch } from 'toolkit/chakra/switch';
import { TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
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
import LoadersShowcase from 'ui/showcases/Loaders';
import MenuShowcase from 'ui/showcases/Menu';
import PaginationShowcase from 'ui/showcases/Pagination';
import PinInputShowcase from 'ui/showcases/PinInput';
import ProgressCircleShowcase from 'ui/showcases/ProgressCircle';
import RadioShowcase from 'ui/showcases/Radio';
import SelectShowcase from 'ui/showcases/Select';
import TabsShowcase from 'ui/showcases/Tabs';
import TagShowcase from 'ui/showcases/Tag';
import TextareaShowcase from 'ui/showcases/Textarea';
import ToastShowcase from 'ui/showcases/Toast';
import TooltipShowcase from 'ui/showcases/Tooltip';

const tabs = [
  { label: 'Accordion', value: 'accordion', component: <AccordionsShowcase/> },
  { label: 'Alert', value: 'alert', component: <AlertShowcase/> },
  { label: 'Badge', value: 'badge', component: <BadgeShowcase/> },
  { label: 'Button', value: 'button', component: <ButtonShowcase/> },
  { label: 'Checkbox', value: 'checkbox', component: <CheckboxShowcase/> },
  { label: 'Clipboard', value: 'clipboard', component: <ClipboardShowcase/> },
  { label: 'Dialog', value: 'dialog', component: <DialogShowcase/> },
  { label: 'Input', value: 'input', component: <InputShowcase/> },
  { label: 'Link', value: 'link', component: <LinkShowcase/> },
  { label: 'Loaders', value: 'loaders', component: <LoadersShowcase/> },
  { label: 'Menu', value: 'menu', component: <MenuShowcase/> },
  { label: 'Pagination', value: 'pagination', component: <PaginationShowcase/> },
  { label: 'Progress Circle', value: 'progress-circle', component: <ProgressCircleShowcase/> },
  { label: 'Radio', value: 'radio', component: <RadioShowcase/> },
  { label: 'Pin input', value: 'pin-input', component: <PinInputShowcase/> },
  { label: 'Select', value: 'select', component: <SelectShowcase/> },
  { label: 'Tabs', value: 'tabs', component: <TabsShowcase/> },
  { label: 'Tag', value: 'tag', component: <TagShowcase/> },
  { label: 'Textarea', value: 'textarea', component: <TextareaShowcase/> },
  { label: 'Toast', value: 'toast', component: <ToastShowcase/> },
  { label: 'Tooltip', value: 'tooltip', component: <TooltipShowcase/> },
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
        { tabs.map((tab) => tab.component) }
      </TabsRoot>
    </>
  );
};

export default React.memo(ChakraShowcases);
