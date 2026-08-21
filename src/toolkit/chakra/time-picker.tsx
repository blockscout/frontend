// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, Icon, VStack, useControllableState } from '@chakra-ui/react';
import { clamp, delay, range } from 'es-toolkit';
import { padStart } from 'es-toolkit/compat';
import React from 'react';

import ClockIcon from 'src/sprite/icons/clock-light.svg';

import { useDisclosure } from '../hooks/useDisclosure';
import type { ButtonProps } from './button';
import { Button } from './button';
import { CloseButton } from './close-button';
import type { FieldProps } from './field';
import { Field } from './field';
import type { InputProps } from './input';
import { Input } from './input';
import { InputGroup } from './input-group';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from './popover';

const BUTTON_HEIGHT = 32;
const GAP_HEIGHT = 8;

const getLimits = (min?: string, max?: string) => {
  if (!min && !max) {
    return;
  }

  const [ minHour, minMinute ] = min?.split(':').map(Number) ?? [ 0, 0 ];
  const [ maxHour, maxMinute ] = max?.split(':').map(Number) ?? [ 23, 59 ];

  return {
    min: {
      hours: minHour,
      minutes: minMinute,
    },
    max: {
      hours: maxHour,
      minutes: maxMinute,
    },
  };
};

interface IsInLimitsParams {
  value: number;
  type: 'hours' | 'minutes';
  timeValue: {
    hours: number | undefined;
    minutes: number | undefined;
  };
  limits?: Record<'min' | 'max', { hours: number; minutes: number }>;
}

const isInLimits = ({ value, type, timeValue, limits }: IsInLimitsParams) => {
  if (!limits) {
    return true;
  }

  if (type === 'hours') {
    return value >= limits.min.hours && value <= limits.max.hours;
  }

  if (timeValue.hours !== undefined) {
    if (timeValue.hours === limits.min.hours) {
      return value >= limits.min.minutes;
    }

    if (timeValue.hours === limits.max.hours) {
      return value <= limits.max.minutes;
    }
  }

  return true;
};

const formatValue = (hours: number, minutes: number) => {
  return `${ padStart(hours.toString(), 2, '0') }:${ padStart(minutes.toString(), 2, '0') }`;
};

const getDefaultValue = ({ limits, type, timeValue }: Omit<IsInLimitsParams, 'value'>) => {
  if (!limits) {
    return 0;
  }

  if (type === 'hours') {
    if (timeValue.minutes !== undefined) {
      if (timeValue.minutes < limits.min.minutes) {
        return clamp(limits.min.hours + 1, limits.min.hours, limits.max.hours);
      }
    }
    return limits.min.hours;
  }

  if (timeValue.hours !== undefined) {
    if (timeValue.hours === limits.min.hours) {
      return limits.min.minutes;
    }
  }

  return 0;
};

interface TimePickerItemButtonProps extends ButtonProps {
  value: number;
}

const TimePickerItemButton = React.forwardRef<HTMLButtonElement, TimePickerItemButtonProps>(({ value, ...props }, ref) => {
  return (
    <Button
      ref={ ref }
      size="sm"
      variant="plain"
      scrollSnapAlign="start"
      data-value={ value }
      px={ 1 }
      minH={ `${ BUTTON_HEIGHT }px` }
      borderWidth="0"
      fontWeight={ 400 }
      _disabled={{ opacity: 'control.disabled' }}
      _hover={{ color: 'hover' }}
      _selected={{
        bgColor: 'selected.option.bg',
        color: 'whiteAlpha.900',
        _hover: {
          bgColor: 'selected.option.bg',
          color: 'whiteAlpha.900',
        },
      }}
      { ...props }
    >
      { padStart(value.toString(), 2, '0') }
    </Button>
  );
});

export interface TimePickerProps extends Omit<FieldProps, 'children'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  inputProps?: InputProps;
  min?: string;
  max?: string;
}

export const TimePicker = ({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  disabled,
  readOnly,
  inputProps,
  ...rest
}: TimePickerProps) => {

  const hoursContainerRef = React.useRef<HTMLDivElement>(null);
  const minutesContainerRef = React.useRef<HTMLDivElement>(null);

  const { open, onOpenChange } = useDisclosure();
  const limits = React.useMemo(() => getLimits(min, max), [ min, max ]);

  const onHoursChange = React.useCallback((hours: number | undefined) => {
    const [ , minutes ] = value?.split(':') ?? [];
    onValueChange?.(hours !== undefined ? formatValue(hours, Number(minutes ?? 0)) : undefined);
  }, [ value, onValueChange ]);

  const [ hours, setHours ] = useControllableState<number | undefined>({
    value: value?.split(':')[0] ? Number(value.split(':')[0]) : undefined,
    defaultValue: defaultValue?.split(':')[0] ? Number(defaultValue.split(':')[0]) : undefined,
    onChange: onHoursChange,
  });

  const onMinutesChange = React.useCallback((minutes: number | undefined) => {
    const [ hours ] = value?.split(':') ?? [];
    onValueChange?.(minutes !== undefined ? formatValue(Number(hours ?? 0), minutes) : undefined);
  }, [ value, onValueChange ]);

  const [ minutes, setMinutes ] = useControllableState<number | undefined>({
    value: value?.split(':')[1] ? Number(value.split(':')[1]) : undefined,
    defaultValue: defaultValue?.split(':')[1] ? Number(defaultValue.split(':')[1]) : undefined,
    onChange: onMinutesChange,
  });

  const scrollToItem = React.useCallback((hours: number | undefined, minutes: number | undefined, behavior: ScrollBehavior = 'instant') => {
    hours !== undefined && hoursContainerRef.current?.scrollTo({
      top: hours * (BUTTON_HEIGHT + GAP_HEIGHT),
      behavior,
    });
    minutes !== undefined && minutesContainerRef.current?.scrollTo({
      top: minutes * (BUTTON_HEIGHT + GAP_HEIGHT),
      behavior,
    });
  }, []);

  const handleHoursClick = React.useCallback(async(event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    const newValue = Number(button.dataset.value);
    if (Number.isNaN(newValue)) {
      return;
    }
    setHours(newValue);

    const defaultValueMinutes = getDefaultValue({ limits, type: 'minutes', timeValue: { hours: newValue, minutes } });

    if (minutes === undefined) {
      scrollToItem(undefined, defaultValueMinutes, 'smooth');
      return;
    }

    if (!isInLimits({
      value: minutes,
      type: 'minutes',
      timeValue: { hours: newValue, minutes }, limits,
    })) {
      // FIXME: subsequent set state will override the previous one where we set hours
      await delay(0);
      setMinutes(defaultValueMinutes);
      scrollToItem(undefined, defaultValueMinutes, 'smooth');
    }
  }, [ limits, minutes, setHours, setMinutes, scrollToItem ]);

  const handleMinutesClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    const newValue = Number(button.dataset.value);
    if (Number.isNaN(newValue)) {
      return;
    }
    setMinutes(newValue);
    setHours((prev) => {
      if (prev === undefined || !isInLimits({ value: prev, type: 'hours', timeValue: { hours: prev, minutes: newValue }, limits })) {
        const defaultValue = getDefaultValue({ limits, type: 'hours', timeValue: { hours: prev ?? 0, minutes: newValue } });
        scrollToItem(defaultValue, undefined, 'smooth');
        return defaultValue;
      }
      return prev;
    });
  }, [ limits, scrollToItem, setHours, setMinutes ]);

  const handleClear = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHours(undefined);
    setMinutes(undefined);
    scrollToItem(0, 0);
  }, [ setHours, setMinutes, scrollToItem ]);

  const timeValue = React.useMemo(() => ({ hours, minutes }), [ hours, minutes ]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const id = window.requestAnimationFrame(() => {
      scrollToItem(hours ?? 0, minutes ?? 0);
    });

    return () => window.cancelAnimationFrame(id);
    // scroll to the selected time when the popover is opened
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ]);

  React.useEffect(() => {
    if (limits) {
      if (
        (timeValue.hours !== undefined && !isInLimits({ value: timeValue.hours, type: 'hours', timeValue, limits })) ||
        (timeValue.minutes !== undefined && !isInLimits({ value: timeValue.minutes, type: 'minutes', timeValue, limits }))
      ) {
        setHours(undefined);
        setMinutes(undefined);
        scrollToItem(0, 0);
      }
    }
  }, [ limits, timeValue, setHours, setMinutes, scrollToItem ]);

  const closeButtonOpacity = (() => {
    if (hours !== undefined || minutes !== undefined) {
      if (disabled || readOnly) {
        return 'control.disabled';
      }
      return 1;
    }

    return 0;
  })();

  const clockIconTrigger = (() => {
    if (disabled) {
      return 'not-allowed';
    }

    if (readOnly) {
      return 'default';
    }

    return 'pointer';
  })();

  const endElement = (
    <HStack mr={ 2 } gap={ 1 }>
      { !readOnly && (
        <CloseButton
          onClick={ handleClear }
          opacity={ closeButtonOpacity }
          color="icon.secondary"
          _hover={{ color: 'hover' }}
          iconProps={{ p: '1px' }}
          disabled={ disabled }
        />
      ) }
      <Icon
        boxSize={ 5 }
        p="3px"
        color="icon.primary"
        cursor={ clockIconTrigger }
        _hover={{ color: disabled || readOnly ? 'icon.primary' : 'hover' }}
        opacity={ disabled || readOnly ? 'control.disabled' : 1 }
      >
        <ClockIcon/>
      </Icon>
    </HStack>
  );

  const invalid = React.useMemo(() => {
    if (disabled || readOnly || (!min && !max)) {
      return false;
    }

    return !isInLimits({ value: hours ?? 0, type: 'hours', timeValue, limits }) || !isInLimits({ value: minutes ?? 0, type: 'minutes', timeValue, limits });
  }, [ disabled, readOnly, min, max, hours, minutes, timeValue, limits ]);

  return (
    <PopoverRoot
      positioning={{ sameWidth: true }}
      lazyMount={ false }
      unmountOnExit={ false }
      onOpenChange={ !disabled && !readOnly ? onOpenChange : undefined }
      open={ !disabled && !readOnly && open }
    >
      <PopoverTrigger asChild>
        <Field readOnly={ readOnly } disabled={ disabled } invalid={ invalid } { ...rest }>
          <InputGroup endElement={ endElement } >
            <Input
              placeholder="Select time"
              size="sm"
              value={ hours !== undefined && minutes !== undefined ? formatValue(hours, minutes) : '' }
              { ...inputProps }
            />
          </InputGroup>
        </Field>
      </PopoverTrigger>
      <PopoverContent borderRadius="base" w="100%" minW="160px" zIndex="tooltip">
        <PopoverBody>
          <HStack gap={ 3 } alignItems="flex-start">
            <VStack ref={ hoursContainerRef } gap={ `${ GAP_HEIGHT }px` } maxH="232px" overflowY="scroll" scrollbarWidth="none" scrollSnapType="y mandatory">
              { range(0, 24).map(hour => {
                return (
                  <TimePickerItemButton
                    key={ hour }
                    value={ hour }
                    selected={ hours === hour }
                    disabled={ !isInLimits({ value: hour, type: 'hours', timeValue, limits }) }
                    onClick={ handleHoursClick }
                  />
                );
              }) }
            </VStack>
            <VStack ref={ minutesContainerRef } gap={ `${ GAP_HEIGHT }px` } maxH="232px" overflowY="scroll" scrollbarWidth="none" scrollSnapType="y mandatory">
              { range(0, 60).map(minute => {
                return (
                  <TimePickerItemButton
                    key={ minute }
                    value={ minute }
                    selected={ minutes === minute }
                    disabled={ !isInLimits({ value: minute, type: 'minutes', timeValue, limits }) }
                    onClick={ handleMinutesClick }
                  />
                );
              }) }
            </VStack>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
