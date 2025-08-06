import { Flex, VStack } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { ZetaChainCCTXFilterParams } from 'types/api/zetaChain';

import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import AddButton from 'toolkit/components/buttons/AddButton';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

const FILTER_PARAM_SENDER = 'sender_address';

type Props = {
  value?: Array<string>;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: Array<string>) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

type InputProps = {
  address?: string;
  isLast: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onAddFieldClick: () => void;
};

const SenderFilterInput = ({ address, onChange, onClear, isLast, onAddFieldClick }: InputProps) => {
  return (
    <Flex alignItems="center" w="100%">
      <InputGroup
        flexGrow={ 1 }
        endElement={ <ClearButton onClick={ onClear } mx={ 2 } disabled={ !address }/> }
      >
        <Input value={ address } onChange={ onChange } placeholder="Sender address" size="sm" autoComplete="off"/>
      </InputGroup>
      { isLast && (
        <AddButton
          ml={ 2 }
          onClick={ onAddFieldClick }
        />
      ) }
    </Flex>
  );
};

const emptyItem = { address: '' };

const ZetaChainSenderFilter = ({ value = [], handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<{ address: string }>>([ ...value.map(addr => ({ address: addr })), emptyItem ]);

  const handleAddressChange = React.useCallback((index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(prev => {
      const newValue = [ ...prev ];
      newValue[index] = { address: event.target.value };
      return newValue;
    });
  }, []);

  const handleAddressClear = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      const newValue = [ ...prev ];
      newValue[index] = { address: '' };
      return newValue;
    });
  }, []);

  const handleAddField = React.useCallback(() => {
    setCurrentValue(prev => [ ...prev, { address: '' } ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([ emptyItem ]), []);

  const onFilter = React.useCallback(() => {
    const addresses = currentValue
      .map(item => item.address.trim())
      .filter(address => address.length > 0);

    handleFilterChange(FILTER_PARAM_SENDER, addresses.length > 0 ? addresses : undefined);
    onClose?.();
  }, [ handleFilterChange, currentValue, onClose ]);

  return (
    <TableColumnFilter
      title="Sender Addresses"
      isFilled={ Boolean(currentValue.some(item => item.address.trim().length > 0)) }
      isTouched={ !isEqual(
        currentValue.map(item => item.address.trim()).filter(Boolean).sort(),
        value.sort(),
      ) }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <VStack gap={ 2 } align="stretch">
        { currentValue.map((item, index) => (
          <SenderFilterInput
            key={ index }
            address={ item.address }
            isLast={ index === currentValue.length - 1 }
            onChange={ handleAddressChange(index) }
            onClear={ handleAddressClear(index) }
            onAddFieldClick={ handleAddField }
          />
        )) }
      </VStack>
    </TableColumnFilter>
  );
};

export default ZetaChainSenderFilter;
