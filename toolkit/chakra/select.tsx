'use client';

import type { ListCollection } from '@chakra-ui/react';
import { Box, Select as ChakraSelect, createListCollection, Flex, Portal, useSelectContext } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import * as React from 'react';

import FilterInput from 'ui/shared/filters/FilterInput';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

export interface SelectOption<Value extends string = string> {
  value: Value;
  label: string;
  icon?: IconName | React.ReactNode;
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

interface SelectValueTextProps extends Omit<ChakraSelect.ValueTextProps, 'children'> {
  children?(items: Array<SelectOption>): React.ReactNode;
  size?: SelectRootProps['size'];
  required?: boolean;
  invalid?: boolean;
  errorText?: string;
}

export const SelectValueText = React.forwardRef<
  HTMLSpanElement,
  SelectValueTextProps
>(function SelectValueText(props, ref) {
  const { children, size, required, invalid, errorText, ...rest } = props;
  const context = useSelectContext();

  const content = (() => {
    const items = context.selectedItems;

    const placeholder = `${ props.placeholder }${ required ? '*' : '' }${ invalid && errorText ? ` - ${ errorText }` : '' }`;

    if (items.length === 0) return placeholder;

    if (children) return children(items);

    if (items.length === 1) {
      const item = items[0] as SelectOption;

      if (!item) return placeholder;

      const icon = (() => {
        if (item.icon) {
          return typeof item.icon === 'string' ? <IconSvg name={ item.icon as IconName } boxSize={ 5 } flexShrink={ 0 }/> : item.icon;
        }

        return null;
      })();

      const label = size === 'lg' ? (
        <Box
          textStyle="xs"
          color={ invalid ? 'field.placeholder.error' : 'field.placeholder' }
          display="-webkit-box"
        >
          { placeholder }
        </Box>
      ) : null;

      return (
        <>
          { label }
          <Flex display="inline-flex" alignItems="center" flexWrap="nowrap" gap={ 1 }>
            { icon }
            <span style={{
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
            }}>
              { context.collection.stringifyItem(item) }
            </span>
          </Flex>
        </>
      );
    }

    // FIXME: we don't have multiple selection in the select yet
    return `${ items.length } selected`;
  })();

  return (
    <ChakraSelect.ValueText
      ref={ ref }
      { ...rest }
    >
      { content }
    </ChakraSelect.ValueText>
  );
});

export interface SelectRootProps extends ChakraSelect.RootProps {}

export const SelectRoot = React.forwardRef<
  HTMLDivElement,
  ChakraSelect.RootProps
>(function SelectRoot(props, ref) {
  const { lazyMount = true, unmountOnExit = true, ...rest } = props;
  return (
    <ChakraSelect.Root
      ref={ ref }
      lazyMount={ lazyMount }
      unmountOnExit={ unmountOnExit }
      { ...rest }
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
  collection: ListCollection<SelectOption>;
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
  errorText?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const { collection, placeholder, portalled = true, loading, errorText, ...rest } = props;
  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText
          placeholder={ placeholder }
          size={ props.size }
          required={ props.required }
          invalid={ props.invalid }
          errorText={ errorText }
        />
      </SelectControl>
      <SelectContent portalled={ portalled }>
        { collection.items.map((item: SelectOption) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
});

export interface SelectAsyncProps extends Omit<SelectProps, 'collection'> {
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
  loadOptions: (input: string, currentValue: Array<string>) => Promise<ListCollection<SelectOption>>;
  extraControls?: React.ReactNode;
}

export const SelectAsync = React.forwardRef<HTMLDivElement, SelectAsyncProps>((props, ref) => {
  const { placeholder, portalled = true, loading, loadOptions, extraControls, onValueChange, errorText, ...rest } = props;

  const [ collection, setCollection ] = React.useState<ListCollection<SelectOption>>(createListCollection<SelectOption>({ items: [] }));
  const [ inputValue, setInputValue ] = React.useState('');
  const [ value, setValue ] = React.useState<Array<string>>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    loadOptions(debouncedInputValue, value).then(setCollection);
  }, [ debouncedInputValue, loadOptions, value ]);

  const handleFilterChange = React.useCallback((value: string) => {
    setInputValue(value);
  }, [ ]);

  const handleValueChange = React.useCallback(({ value, items }: { value: Array<string>; items: Array<SelectOption> }) => {
    setValue(value);
    onValueChange?.({ value, items });
  }, [ onValueChange ]);

  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      onValueChange={ handleValueChange }
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText
          placeholder={ placeholder }
          size={ props.size }
          required={ props.required }
          invalid={ props.invalid }
          errorText={ errorText }
        />
      </SelectControl>
      <SelectContent portalled={ portalled }>
        <Box px="4">
          <FilterInput
            placeholder="Search"
            initialValue={ inputValue }
            onChange={ handleFilterChange }
            inputProps={{ pl: '9' }}
          />
          { extraControls }
        </Box>
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
});
