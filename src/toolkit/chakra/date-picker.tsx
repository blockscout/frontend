// SPDX-License-Identifier: LicenseRef-Blockscout

import { DatePicker as ChakraDatePicker, HStack, Icon, Portal } from '@chakra-ui/react';

import ArrowIcon from 'src/sprite/icons/arrows/east-mini.svg';
import CalendarIcon from 'src/sprite/icons/calendar.svg';

import { CloseButton } from './close-button';
import { Field } from './field';
import { InputGroup } from './input-group';

interface DatePickerProps extends ChakraDatePicker.RootProps {}

export const DatePicker = ({ placeholder, ...rest }: DatePickerProps) => {
  const positioning = {
    placement: 'bottom-start' as const,
    overflowPadding: 4,
    sameWidth: true,
    ...rest.positioning,
    offset: {
      mainAxis: 4,
      ...rest.positioning?.offset,
    },
  };

  return (
    <ChakraDatePicker.Root
      closeOnSelect
      openOnClick
      lazyMount
      unmountOnExit
      { ...rest }
      positioning={ positioning }
    >
      <ChakraDatePicker.Control>
        <ChakraDatePicker.Context>
          { (context) => {
            const isFilled = context.value.length > 0;

            const endElement = (
              <HStack>
                { isFilled && (
                  <ChakraDatePicker.ClearTrigger asChild>
                    <CloseButton/>
                  </ChakraDatePicker.ClearTrigger>
                ) }
                <ChakraDatePicker.Trigger>
                  <Icon boxSize={ 6 }><CalendarIcon/></Icon>
                </ChakraDatePicker.Trigger>
              </HStack>
            );

            return (
              <Field
                label={ placeholder ?? 'Date' }
                floating
                size="lg"
              >
                <InputGroup endElement={ endElement } endElementProps={{ pl: 2, pr: 4 }}>
                  <ChakraDatePicker.Input/>
                </InputGroup>
              </Field>
            );
          } }
        </ChakraDatePicker.Context>
      </ChakraDatePicker.Control>
      <Portal>
        <ChakraDatePicker.Positioner>
          <ChakraDatePicker.Content>
            { [ 'day' as const, 'month' as const, 'year' as const ].map((view) => (
              <ChakraDatePicker.View key={ view } view={ view }>
                <ChakraDatePicker.ViewControl>
                  <ChakraDatePicker.PrevTrigger>
                    <Icon boxSize={ 6 }><ArrowIcon/></Icon>
                  </ChakraDatePicker.PrevTrigger>
                  <ChakraDatePicker.ViewTrigger>
                    <ChakraDatePicker.RangeText/>
                  </ChakraDatePicker.ViewTrigger>
                  <ChakraDatePicker.NextTrigger>
                    <Icon boxSize={ 6 } transform="rotate(180deg)"><ArrowIcon/></Icon>
                  </ChakraDatePicker.NextTrigger>
                </ChakraDatePicker.ViewControl>
                { view === 'day' && <ChakraDatePicker.DayTable/> }
                { view === 'month' && <ChakraDatePicker.MonthTable/> }
                { view === 'year' && <ChakraDatePicker.YearTable/> }
              </ChakraDatePicker.View>
            )) }
          </ChakraDatePicker.Content>
        </ChakraDatePicker.Positioner>
      </Portal>
    </ChakraDatePicker.Root>
  );
};
