import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXFilterParams, ZetaChainCCTXStatusReduced, ZetaChainCCTXStatusReducedFilter } from 'types/api/zetaChain';

import { Radio, RadioGroup } from 'toolkit/chakra/radio';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

const FILTER_PARAM_STATUS = 'status_reduced';

type FilterValue = 'all' | ZetaChainCCTXStatusReduced;

const STATUS_OPTIONS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
];

// Helper function to convert uppercase status to capitalized for API
const convertStatusForAPI = (status: ZetaChainCCTXStatusReduced): ZetaChainCCTXStatusReducedFilter => {
  switch (status) {
    case 'SUCCESS':
      return 'Success';
    case 'PENDING':
      return 'Pending';
    case 'FAILED':
      return 'Failed';
  }
};

// Helper function to convert capitalized status to uppercase for internal use
const convertStatusFromAPI = (status: string): ZetaChainCCTXStatusReduced | null => {
  switch (status) {
    case 'Success':
      return 'SUCCESS';
    case 'Pending':
      return 'PENDING';
    case 'Failed':
      return 'FAILED';
    default:
      return null;
  }
};

type Props = {
  value?: Array<ZetaChainCCTXStatusReducedFilter>;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: Array<ZetaChainCCTXStatusReducedFilter>) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const ZetaChainStatusFilter = ({ value = [], handleFilterChange, onClose }: Props) => {
  // Convert API values to internal format and determine initial state
  const getInitialValue = React.useCallback((): FilterValue => {
    if (!value || value.length === 0) {
      return 'all';
    }
    if (value.length === 1) {
      const converted = convertStatusFromAPI(value[0]);
      return converted || 'all';
    }
    return 'all';
  }, [ value ]);

  const [ currentValue, setCurrentValue ] = React.useState<FilterValue>(getInitialValue());

  const handleStatusChange = React.useCallback((value: FilterValue) => {
    setCurrentValue(value);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue('all'), []);

  const onFilter = React.useCallback(() => {
    let convertedValue: Array<ZetaChainCCTXStatusReducedFilter> | undefined;

    if (currentValue === 'all') {
      convertedValue = undefined;
    } else {
      convertedValue = [ convertStatusForAPI(currentValue) ];
    }

    handleFilterChange(FILTER_PARAM_STATUS, convertedValue);
    onClose?.();
  }, [ handleFilterChange, currentValue, onClose ]);

  // Check if the current value is different from the initial value
  const isTouched = React.useMemo(() => {
    const initialValue = getInitialValue();
    return currentValue !== initialValue;
  }, [ currentValue, getInitialValue ]);

  const handleRadioChange = React.useCallback(({ value }: { value: string | null }) => {
    if (value) {
      handleStatusChange(value as FilterValue);
    }
  }, [ handleStatusChange ]);

  return (
    <TableColumnFilter
      title="Status"
      isFilled={ currentValue !== 'all' }
      isTouched={ isTouched }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <Flex direction="column" gap={ 2 }>
        <RadioGroup value={ currentValue } onValueChange={ handleRadioChange }>
          { STATUS_OPTIONS.map(option => (
            <Radio key={ option.value } value={ option.value }>
              { option.label }
            </Radio>
          )) }
        </RadioGroup>
      </Flex>
    </TableColumnFilter>
  );
};

export default ZetaChainStatusFilter;
