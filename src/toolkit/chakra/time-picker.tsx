// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import { HStack, Icon, VStack, useControllableState } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import { padStart } from 'es-toolkit/compat';
import React from 'react';

import ClockIcon from 'src/sprite/icons/clock-light.svg';

import { useDisclosure } from '../hooks/useDisclosure';
import type { ButtonProps } from './button';
import { Button } from './button';
import { Input } from './input';
import { InputGroup } from './input-group';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from './popover';

const stripLeadingZero = (value?: string) => {
  return value && value.length > 1 && value[0] === '0' ? value.slice(1) : value;
};

interface TimePickerItemButtonProps extends ButtonProps {
  value: string;
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
      minH={ 8 }
      borderWidth="0"
      fontWeight={ 400 }
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
      { padStart(value, 2, '0') }
    </Button>
  );
});

export interface TimePickerProps extends JsxStyleProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const TimePicker = ({ value, defaultValue, onChange, ...rest }: TimePickerProps) => {

  const hoursContainerRef = React.useRef<HTMLDivElement>(null);
  const minutesContainerRef = React.useRef<HTMLDivElement>(null);

  const { open, onOpenChange } = useDisclosure();

  const onHoursChange = React.useCallback((hours: string) => {
    const [ , minutes ] = value?.split(':') ?? [];
    onChange?.(`${ hours }:${ minutes ?? '0' }`);
  }, [ value, onChange ]);

  const [ hours, setHours ] = useControllableState({
    value: value?.split(':')[0],
    defaultValue: defaultValue?.split(':')[0],
    onChange: onHoursChange,
  });

  const onMinutesChange = React.useCallback((minutes: string) => {
    const [ hours ] = value?.split(':') ?? [];
    onChange?.(`${ hours ?? '0' }:${ minutes }`);
  }, [ value, onChange ]);

  const [ minutes, setMinutes ] = useControllableState({
    value: value?.split(':')[1],
    defaultValue: defaultValue?.split(':')[1],
    onChange: onMinutesChange,
  });

  const handleHoursClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    setHours(button.dataset.value ?? '0');
  }, [ setHours ]);

  const handleMinutesClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    setHours((prev) => prev ?? '0');
    setMinutes(button.dataset.value ?? '0');
  }, [ setHours, setMinutes ]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const id = window.requestAnimationFrame(() => {
      const BUTTON_HEIGHT = 32;
      const GAP_HEIGHT = 8;
      hours && hoursContainerRef.current?.scrollTo({
        top: (Number(hours) * BUTTON_HEIGHT) + ((Number(hours) - 1) * GAP_HEIGHT),
        behavior: 'instant',
      });
      minutes && minutesContainerRef.current?.scrollTo({
        top: (Number(minutes) * BUTTON_HEIGHT) + ((Number(minutes) - 1) * GAP_HEIGHT),
        behavior: 'instant',
      });
    });

    return () => window.cancelAnimationFrame(id);
    // scroll to the selected time when the popover is opened
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ]);

  const endElement = <Icon boxSize={ 5 } p="3px" mx={ 2 }><ClockIcon/></Icon>;

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
            value={ hours && minutes ? `${ padStart(hours, 2, '0') }:${ padStart(minutes, 2, '0') }` : '' }
            { ...rest }
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent borderRadius="base" w="100%" >
        <PopoverBody>
          <HStack gap={ 3 } alignItems="flex-start">
            <VStack ref={ hoursContainerRef } maxH="232px" overflowY="scroll" scrollbarWidth="none" scrollSnapType="y mandatory">
              { range(0, 24).map(hour => {
                return (
                  <TimePickerItemButton
                    key={ hour }
                    value={ hour.toString() }
                    selected={ stripLeadingZero(hours) === hour.toString() }
                    onClick={ handleHoursClick }
                  />
                );
              }) }
            </VStack>
            <VStack ref={ minutesContainerRef } maxH="232px" overflowY="scroll" scrollbarWidth="none" scrollSnapType="y mandatory">
              { range(0, 60).map(minute => {
                return (
                  <TimePickerItemButton
                    key={ minute }
                    value={ minute.toString() }
                    selected={ stripLeadingZero(minutes) === minute.toString() }
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
