import { Flex, VStack, createListCollection } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { CrossChainInfo } from 'types/client/crossChainInfo';
import type { ZetaChainCCTXFilterParams } from 'types/client/zetaChain';

import { Image } from 'toolkit/chakra/image';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption } from 'toolkit/chakra/select';
import AddButton from 'toolkit/components/buttons/AddButton';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';
import IconSvg from 'ui/shared/IconSvg';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  value?: Array<string>;
  chainValue?: Array<string>;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: Array<string> | Array<string>) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
  filterParam: keyof ZetaChainCCTXFilterParams;
  chainFilterParam: keyof ZetaChainCCTXFilterParams;
  title: string;
  placeholder: string;
};

type InputProps = {
  address?: string;
  isLast: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onAddFieldClick: () => void;
  placeholder: string;
};

type ChainSelectProps = {
  selectedChains: Array<string>;
  onChainChange: (chains: Array<string>) => void;
  chains: Array<CrossChainInfo>;
  isLoading: boolean;
};

const AddressFilterInput = ({ address, onChange, onClear, isLast, onAddFieldClick, placeholder }: InputProps) => {
  return (
    <Flex alignItems="center" w="100%">
      <InputGroup
        flexGrow={ 1 }
        endElement={ <ClearButton onClick={ onClear } mx={ 2 } disabled={ !address }/> }
      >
        <Input value={ address } onChange={ onChange } placeholder={ placeholder } size="sm" autoComplete="off"/>
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

const ChainSelect = ({ selectedChains, onChainChange, chains, isLoading }: ChainSelectProps) => {
  const collection = React.useMemo(() => {
    const options: Array<SelectOption> = [
      { value: 'all', label: 'All chains' },
      ...chains.map(chain => ({
        value: chain.chain_id.toString(),
        label: chain.chain_name || `Chain ${ chain.chain_id }`,
        renderLabel: () => (
          <Flex alignItems="center" gap={ 2 }>
            { chain.chain_logo ? (
              <Image src={ chain.chain_logo } boxSize={ 5 } borderRadius="base" alt={ chain.chain_name || 'chain logo' }/>
            ) : (
              <IconSvg name="networks/icon-placeholder" boxSize={ 5 } color="text.secondary"/>
            ) }
            <span>{ chain.chain_name || `Chain ${ chain.chain_id }` }</span>
          </Flex>
        ),
      })),
    ];
    return createListCollection<SelectOption>({ items: options });
  }, [ chains ]);

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const chainIds = value.filter(v => v !== 'all');
    onChainChange(chainIds);
  }, [ onChainChange ]);

  const selectedValues = React.useMemo(() => {
    if (selectedChains.length === 0) {
      return [ 'all' ];
    }
    return selectedChains.map(id => id.toString());
  }, [ selectedChains ]);

  return (
    <Select
      collection={ collection }
      placeholder="Select chains"
      value={ selectedValues }
      onValueChange={ handleValueChange }
      loading={ isLoading }
      size="sm"
      positioning={{
        placement: 'bottom-start',
        sameWidth: true,
        offset: { mainAxis: 4 },
      }}
      contentProps={{
        zIndex: 'modal2',
      }}
    />
  );
};

const emptyItem = { address: '' };

const ZetaChainAddressFilter = ({
  value = [],
  chainValue = [],
  handleFilterChange,
  onClose,
  filterParam,
  chainFilterParam,
  title,
  placeholder,
}: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<{ address: string }>>([ ...value.map(addr => ({ address: addr })), emptyItem ]);
  const [ currentChainValue, setCurrentChainValue ] = React.useState<Array<string>>(chainValue.map(String));

  const { data: chains = [], isPending: isChainsLoading } = useZetaChainConfig();

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

  const handleChainChange = React.useCallback((chains: Array<string>) => {
    setCurrentChainValue(chains);
  }, []);

  const onReset = React.useCallback(() => {
    setCurrentValue([ emptyItem ]);
    setCurrentChainValue([]);
  }, []);

  const onFilter = React.useCallback(() => {
    const addresses = currentValue
      .map(item => item.address.trim())
      .filter(address => address.length > 0);

    const chainIds = currentChainValue.length > 0 ? currentChainValue : undefined;

    handleFilterChange(filterParam, addresses.length > 0 ? addresses : undefined);
    handleFilterChange(chainFilterParam, chainIds);
    onClose?.();
  }, [ handleFilterChange, currentValue, currentChainValue, onClose, filterParam, chainFilterParam ]);

  const isFilled = Boolean(
    currentValue.some(item => item.address.trim().length > 0) ||
    currentChainValue.length > 0,
  );

  const isTouched = !isEqual(
    currentValue.map(item => item.address.trim()).filter(Boolean).sort(),
    value.sort(),
  ) || !isEqual(currentChainValue.sort(), chainValue.sort());

  return (
    <TableColumnFilter
      title={ title }
      isFilled={ isFilled }
      isTouched={ isTouched }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <VStack gap={ 3 } align="stretch">
        <ChainSelect
          selectedChains={ currentChainValue }
          onChainChange={ handleChainChange }
          chains={ chains }
          isLoading={ isChainsLoading }
        />
        <VStack gap={ 2 } align="stretch">
          { currentValue.map((item, index) => (
            <AddressFilterInput
              key={ index }
              address={ item.address }
              isLast={ index === currentValue.length - 1 }
              onChange={ handleAddressChange(index) }
              onClear={ handleAddressClear(index) }
              onAddFieldClick={ handleAddField }
              placeholder={ placeholder }
            />
          )) }
        </VStack>
      </VStack>
    </TableColumnFilter>
  );
};

export default ZetaChainAddressFilter;
