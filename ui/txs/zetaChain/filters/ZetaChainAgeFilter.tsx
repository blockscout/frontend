import { Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import { type ZetaChainCCTXFilterParams } from 'types/api/zetaChain';

import dayjs from 'lib/date/dayjs';
import { Input } from 'toolkit/chakra/input';
import { ndash } from 'toolkit/utils/htmlEntities';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

const FILTER_PARAM_FROM = 'start_timestamp';
const FILTER_PARAM_TO = 'end_timestamp';

const defaultValue = { from: '', to: '' } as const;
type AgeFromToValue = { from: string; to: string };

type Props = {
  value?: AgeFromToValue;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: string) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const DateInput = ({ value, onChange, placeholder, max }: { value: string; onChange: (value: string) => void; placeholder: string; max: string }) => {
  const [ tempValue, setTempValue ] = React.useState(value ? dayjs(Number(value) * 1000).format('YYYY-MM-DD') : '');

  // reset
  React.useEffect(() => {
    if (!value) {
      setTempValue('');
    }
  }, [ value ]);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTempValue(event.target.value);
    onChange(event.target.value);
  }, [ onChange ]);

  return (
    <Input
      value={ tempValue }
      onChange={ handleChange }
      placeholder={ placeholder }
      type="date"
      max={ max }
      autoComplete="off"
      size="sm"
    />
  );
};

const ZetaChainAgeFilter = ({ value = defaultValue, handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<AgeFromToValue>({
    from: value.from || '',
    to: value.to || '',
  });

  const handleFromChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', to: prev.to, from: newValue }));
  }, []);

  const handleToChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', from: prev.from, to: newValue }));
  }, []);

  const onReset = React.useCallback(() => setCurrentValue(defaultValue), []);

  const onFilter = React.useCallback(() => {
    if (!currentValue.to && !currentValue.from) {
      handleFilterChange(FILTER_PARAM_FROM, undefined);
      handleFilterChange(FILTER_PARAM_TO, undefined);
      return;
    }
    const from = dayjs(currentValue.from || undefined).startOf('day').unix().toString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = dayjs(currentValue.to || undefined).endOf('day').unix().toString();
    handleFilterChange(FILTER_PARAM_TO, to);
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Set last duration"
      isFilled={ Boolean(currentValue.from || currentValue.to) }
      isTouched={ !isEqual(currentValue, value) }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <Flex mt={ 3 }>
        <DateInput
          value={ currentValue.from }
          onChange={ handleFromChange }
          placeholder="From"
          max={ dayjs().format('YYYY-MM-DD') }
        />
        <Text mx={ 3 }>{ ndash }</Text>
        <DateInput
          value={ currentValue.to }
          onChange={ handleToChange }
          placeholder="To"
          max={ dayjs().format('YYYY-MM-DD') }
        />
      </Flex>
    </TableColumnFilter>
  );
};

export default ZetaChainAgeFilter;
