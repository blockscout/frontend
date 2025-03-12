'use client';

import type { CollectionItem, ListCollection } from '@chakra-ui/react';
import { Select as ChakraSelect, Portal, useSelectContext } from '@chakra-ui/react';
import * as React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

export interface SelectOption<Value extends string = string> {
  value: Value;
  label: string;
}

export interface SelectControlProps extends ChakraSelect.ControlProps {
  clearable?: boolean;
  noIndicator?: boolean;
  triggerProps?: ChakraSelect.TriggerProps;
  loading?: boolean;
}

export const SelectControl = React.forwardRef<
  HTMLButtonElement,
  SelectControlProps
>(function SelectControl(props, ref) {
  // NOTE: here defaultValue means the "default" option of the select, not its initial value
  const { children, clearable, noIndicator, triggerProps, loading, defaultValue, ...rest } = props;

  const context = useSelectContext();
  const isDefaultValue = Array.isArray(defaultValue) ? context.value.every((item) => defaultValue.includes(item)) : context.value === defaultValue;

  return (
    <Skeleton loading={ loading } asChild>
      <ChakraSelect.Control { ...rest } className="group">
        <ChakraSelect.Trigger ref={ ref } { ...triggerProps } data-default-value={ isDefaultValue }>{ children }</ChakraSelect.Trigger>
        { (!noIndicator || clearable) && (
          <ChakraSelect.IndicatorGroup>
            { clearable && <SelectClearTrigger/> }
            { !noIndicator && (
              <ChakraSelect.Indicator
                transform="rotate(-90deg)"
                _open={{ transform: 'rotate(90deg)' }}
                flexShrink={ 0 }
              >
                <IconSvg name="arrows/east-mini"/>
              </ChakraSelect.Indicator>
            ) }
          </ChakraSelect.IndicatorGroup>
        ) }
      </ChakraSelect.Control>
    </Skeleton>
  );
});

const SelectClearTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraSelect.ClearTriggerProps
>(function SelectClearTrigger(props, ref) {
  return (
    <ChakraSelect.ClearTrigger asChild { ...props } ref={ ref }>
      <CloseButton
        variant="plain"
        focusVisibleRing="inside"
        focusRingWidth="2px"
        pointerEvents="auto"
      />
    </ChakraSelect.ClearTrigger>
  );
});

interface SelectContentProps extends ChakraSelect.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(function SelectContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;
  return (
    <Portal disabled={ !portalled } container={ portalRef }>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content { ...rest } ref={ ref }/>
      </ChakraSelect.Positioner>
    </Portal>
  );
});

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  ChakraSelect.ItemProps
>(function SelectItem(props, ref) {
  const { item, children, ...rest } = props;
  return (
    <ChakraSelect.Item key={ item.value } item={ item } { ...rest } ref={ ref }>
      <ChakraSelect.ItemIndicator asChild>
        <IconSvg name="check" boxSize={ 5 } flexShrink={ 0 }/>
      </ChakraSelect.ItemIndicator>
      { children }
    </ChakraSelect.Item>
  );
});

interface SelectValueTextProps
  extends Omit<ChakraSelect.ValueTextProps, 'children'> {
  children?(items: Array<CollectionItem>): React.ReactNode;
}

export const SelectValueText = React.forwardRef<
  HTMLSpanElement,
  SelectValueTextProps
>(function SelectValueText(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraSelect.ValueText { ...rest } ref={ ref }>
      <ChakraSelect.Context>
        { (select) => {
          const items = select.selectedItems;
          if (items.length === 0) return props.placeholder;
          if (children) return children(items);
          if (items.length === 1)
            return select.collection.stringifyItem(items[0]);
          return `${ items.length } selected`;
        } }
      </ChakraSelect.Context>
    </ChakraSelect.ValueText>
  );
});

export interface SelectRootProps extends ChakraSelect.RootProps {}

export const SelectRoot = React.forwardRef<
  HTMLDivElement,
  ChakraSelect.RootProps
>(function SelectRoot(props, ref) {
  return (
    <ChakraSelect.Root
      { ...props }
      ref={ ref }
      positioning={{ sameWidth: false, ...props.positioning, offset: { mainAxis: 4, ...props.positioning?.offset } }}
    >
      { props.asChild ? (
        props.children
      ) : (
        <>
          <ChakraSelect.HiddenSelect/>
          { props.children }
        </>
      ) }
    </ChakraSelect.Root>
  );
}) as ChakraSelect.RootComponent;

interface SelectItemGroupProps extends ChakraSelect.ItemGroupProps {
  label: React.ReactNode;
}

export const SelectItemGroup = React.forwardRef<
  HTMLDivElement,
  SelectItemGroupProps
>(function SelectItemGroup(props, ref) {
  const { children, label, ...rest } = props;
  return (
    <ChakraSelect.ItemGroup { ...rest } ref={ ref }>
      <ChakraSelect.ItemGroupLabel>{ label }</ChakraSelect.ItemGroupLabel>
      { children }
    </ChakraSelect.ItemGroup>
  );
});

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;

export interface SelectProps extends SelectRootProps {
  collection: ListCollection<CollectionItem>;
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const { collection, placeholder, portalled = true, loading, ...rest } = props;
  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      variant="outline"
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText placeholder={ placeholder }/>
      </SelectControl>
      <SelectContent portalled={ portalled }>
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
});
