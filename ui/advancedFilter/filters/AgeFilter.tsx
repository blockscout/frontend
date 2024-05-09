import { Flex, Input, Tag, Text } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';

import { ADVANCED_FILTER_AGES, type AdvancedFilterAge, type AdvancedFilterParams } from 'types/api/advancedFilter';

import dayjs from 'lib/date/dayjs';
import { ndash } from 'lib/html-entities';

import ColumnFilter from '../ColumnFilter';
import { getDurationFromAge } from '../lib';

const FILTER_PARAM_FROM = 'age_from';
const FILTER_PARAM_TO = 'age_to';
const FILTER_PARAM_AGE = 'age';

const defaultValue = { age: undefined, from: '', to: '' };
type AgeFromToValue = { age?: AdvancedFilterAge; from?: string; to?: string }

type Props = {
  value?: AgeFromToValue;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value?: string) => void;
  columnName: string;
}

const AgeFilter = ({ value = {}, handleFilterChange, columnName }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<AgeFromToValue>(value || defaultValue);

  const handleFromChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(prev => ({ to: prev.to, from: event.target.value }));
  }, []);

  const handleToChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(prev => ({ from: prev.from, to: event.target.value }));
  }, []);

  const onPresetClick = React.useCallback((event: React.SyntheticEvent) => {
    const age = (event.currentTarget as HTMLDivElement).getAttribute('data-id') as AdvancedFilterAge;
    setCurrentValue({ age });
  }, []);

  const onReset = React.useCallback(() => setCurrentValue(defaultValue), []);

  const onFilter = React.useCallback(() => {
    const from = currentValue.age ?
      dayjs((dayjs().valueOf() - getDurationFromAge(currentValue.age))).toISOString() :
      dayjs(currentValue.from).startOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = currentValue.age ? dayjs().toISOString() : dayjs(currentValue.to).endOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, currentValue.age);
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilter
      columnName={ columnName }
      title="Set last duration"
      isFilled={ Boolean(currentValue.from || currentValue.to || currentValue.age) }
      isActive={ Boolean(value.from || value.to || value.age) }
      onFilter={ onFilter }
      onReset={ onReset }
      w="382px"
    >
      <Flex gap={ 3 }>
        { ADVANCED_FILTER_AGES.map(val => (
          <Tag
            key={ val }
            data-id={ val }
            onClick={ onPresetClick }
            colorScheme={ currentValue.age === val ? 'blue' : 'gray-blue' }
            _hover={{ opacity: 0.76 }}
            cursor="pointer"
          >
            { val }
          </Tag>
        )) }
      </Flex>
      <Flex mt={ 3 }>
        <Input value={ currentValue.from } onChange={ handleFromChange } placeholder="From" type="date" size="xs"/>
        <Text mx={ 3 }>{ ndash }</Text>
        <Input value={ currentValue.to } onChange={ handleToChange } placeholder="To" type="date" size="xs"/>
      </Flex>
    </ColumnFilter>
  );
};

export default AgeFilter;
