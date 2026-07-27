// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import { HStack, Icon, VStack, useControllableState } from '@chakra-ui/react';
import { clamp, range } from 'es-toolkit';
import { padStart } from 'es-toolkit/compat';
import React from 'react';

import ClockIcon from 'src/sprite/icons/clock-light.svg';

import { useDisclosure } from '../hooks/useDisclosure';
import type { ButtonProps } from './button';
import { Button } from './button';
import { CloseButton } from './close-button';
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

export interface TimePickerProps extends JsxStyleProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
}

export const TimePicker = ({ value, defaultValue, onChange, min, max, ...rest }: TimePickerProps) => {

  const hoursContainerRef = React.useRef<HTMLDivElement>(null);
  const minutesContainerRef = React.useRef<HTMLDivElement>(null);

  const { open, onOpenChange } = useDisclosure();
  const limits = React.useMemo(() => getLimits(min, max), [ min, max ]);

  const onHoursChange = React.useCallback((hours: number | undefined) => {
    const [ , minutes ] = value?.split(':') ?? [];
    onChange?.(hours ? formatValue(hours, Number(minutes ?? 0)) : '');
  }, [ value, onChange ]);

  const [ hours, setHours ] = useControllableState<number | undefined>({
    value: value?.split(':')[0] ? Number(value.split(':')[0]) : undefined,
    defaultValue: defaultValue?.split(':')[0] ? Number(defaultValue.split(':')[0]) : undefined,
    onChange: onHoursChange,
  });

  const onMinutesChange = React.useCallback((minutes: number | undefined) => {
    const [ hours ] = value?.split(':') ?? [];
    onChange?.(minutes ? formatValue(Number(hours ?? 0), minutes) : '');
  }, [ value, onChange ]);

  const [ minutes, setMinutes ] = useControllableState<number | undefined>({
    value: value?.split(':')[1] ? Number(value.split(':')[1]) : undefined,
    defaultValue: defaultValue?.split(':')[1] ? Number(defaultValue.split(':')[1]) : undefined,
    onChange: onMinutesChange,
  });

  const scrollToItem = React.useCallback((hours: number | undefined, minutes: number | undefined, behavior: ScrollBehavior = 'instant') => {
    hours !== undefined && hoursContainerRef.current?.scrollTo({
      top: (hours * BUTTON_HEIGHT) + ((hours - 1) * GAP_HEIGHT),
      behavior,
    });
    minutes !== undefined && minutesContainerRef.current?.scrollTo({
      top: (minutes * BUTTON_HEIGHT) + ((minutes - 1) * GAP_HEIGHT),
      behavior,
    });
  }, []);

  const handleHoursClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
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
      if (!prev || !isInLimits({ value: prev, type: 'hours', timeValue: { hours: prev, minutes: newValue }, limits })) {
        const defaultValue = getDefaultValue({ limits, type: 'hours', timeValue: { hours: prev ?? 0, minutes: newValue } });
        scrollToItem(defaultValue, undefined, 'smooth');
        return defaultValue;
      }
      return prev;
    });
  }, [ limits, scrollToItem, setHours, setMinutes ]);

  const handleClear = React.useCallback(() => {
    setHours(undefined);
    setMinutes(undefined);
    onChange?.('');
  }, [ setHours, setMinutes, onChange ]);

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

  const endElement = (
    <HStack mr={ 2 } gap={ 1 }>
      { (hours !== undefined || minutes !== undefined) && (
        <CloseButton onClick={ handleClear } color="icon.primary" _hover={{ color: 'hover' }} iconProps={{ p: '1px' }}/>
      ) }
      <Icon boxSize={ 5 } p="3px" color="icon.primary" _hover={{ color: 'hover' }}><ClockIcon/></Icon>
    </HStack>
  );

  const timeValue = { hours, minutes };

  return (
    <PopoverRoot
      positioning={{ sameWidth: true }}
      lazyMount={ false }
      unmountOnExit={ false }
      onOpenChange={ onOpenChange }
      open={ open }
    >
      <PopoverTrigger asChild>
        <InputGroup endElement={ endElement }>
          <Input
            placeholder="Select time"
            size="sm"
            value={ hours && minutes ? formatValue(hours, minutes) : '' }
            { ...rest }
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent borderRadius="base" w="100%" >
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
