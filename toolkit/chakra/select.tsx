'use client';

import type { CollectionItem, ListCollection } from '@chakra-ui/react';
import { Select as ChakraSelect, createListCollection, Portal, useSelectContext } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import * as React from 'react';

import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

export interface SelectOption<Value extends string = string> {
  value: Value;
  label: string;
}

export interface SelectControlProps extends ChakraSelect.ControlProps {
  noIndicator?: boolean;
  triggerProps?: ChakraSelect.TriggerProps;
  loading?: boolean;
}

export const SelectControl = React.forwardRef<
  HTMLButtonElement,
  SelectControlProps
>(function SelectControl(props, ref) {
  // NOTE: here defaultValue means the "default" option of the select, not its initial value
  const { children, noIndicator, triggerProps, loading, defaultValue, ...rest } = props;

  const context = useSelectContext();
  const isDefaultValue = Array.isArray(defaultValue) ? context.value.every((item) => defaultValue.includes(item)) : context.value === defaultValue;

  return (
    <Skeleton loading={ loading } asChild>
      <ChakraSelect.Control { ...rest }>
        <ChakraSelect.Trigger ref={ ref } className="group peer" { ...triggerProps } data-default-value={ isDefaultValue }>{ children }</ChakraSelect.Trigger>
        { (!noIndicator) && (
          <ChakraSelect.IndicatorGroup>
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

export const SelectClearTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraSelect.ClearTriggerProps
>(function SelectClearTrigger(props, ref) {
  return (
    <ChakraSelect.ClearTrigger asChild { ...props } ref={ ref }>
      <CloseButton
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

  const startElement = (() => {
    if (item.icon) {
      return typeof item.icon === 'string' ? <IconSvg name={ item.icon } boxSize={ 5 } flexShrink={ 0 }/> : item.icon;
    }

    return null;
  })();

  return (
    <ChakraSelect.Item key={ item.value } item={ item } { ...rest } ref={ ref }>
      { startElement }
      { children }
      <ChakraSelect.ItemIndicator asChild>
        <IconSvg name="check" boxSize={ 5 } flexShrink={ 0 } ml="auto"/>
      </ChakraSelect.ItemIndicator>
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
    <ChakraSelect.ValueText { ...rest } display="inline-flex" alignItems="center" flexWrap="nowrap" ref={ ref }>
      <ChakraSelect.Context>
        { (select) => {
          const items = select.selectedItems;
          if (items.length === 0) return props.placeholder;

          if (children) return children(items);

          if (items.length === 1) {
            const item = items[0] as CollectionItem & { icon?: React.ReactNode };

            const icon = (() => {
              if (item.icon) {
                return typeof item.icon === 'string' ? <IconSvg name={ item.icon } boxSize={ 5 } flexShrink={ 0 } mr={ 1 }/> : item.icon;
              }

              return null;
            })();

            return (
              <>
                { icon }
                <span style={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                }}>
                  { select.collection.stringifyItem(item) }
                </span>
              </>
            );
          }

          // FIXME: we don't have multiple selection in the select yet
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

export interface SelectAsyncProps extends Omit<SelectRootProps, 'collection'> {
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
  loadOptions: (input: string, currentValue: Array<string>) => Promise<ListCollection<CollectionItem>>;
  extraControls?: React.ReactNode;
}

export const SelectAsync = React.forwardRef<HTMLDivElement, SelectAsyncProps>((props, ref) => {
  const { placeholder, portalled = true, loading, loadOptions, extraControls, onValueChange, ...rest } = props;

  const [ collection, setCollection ] = React.useState<ListCollection<CollectionItem>>(createListCollection({ items: [] }));
  const [ inputValue, setInputValue ] = React.useState('');
  const [ value, setValue ] = React.useState<Array<string>>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    loadOptions(debouncedInputValue, value).then(setCollection);
  }, [ debouncedInputValue, loadOptions, value ]);

  const handleFilterChange = React.useCallback((value: string) => {
    setInputValue(value);
  }, [ ]);

  const handleValueChange = React.useCallback(({ value, items }: { value: Array<string>; items: Array<CollectionItem> }) => {
    setValue(value);
    onValueChange?.({ value, items });
  }, [ onValueChange ]);

  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      variant="outline"
      onValueChange={ handleValueChange }
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText placeholder={ placeholder }/>
      </SelectControl>
      <SelectContent portalled={ portalled }>
        <FilterInput
          placeholder="Search"
          initialValue={ inputValue }
          onChange={ handleFilterChange }
        />
        { extraControls }
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
});
