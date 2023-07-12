import { Accordion, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from 'types/api/contract';

import ContractMethodsAccordionItem from './ContractMethodsAccordionItem';

interface Props<T extends SmartContractMethod> {
  data: Array<T>;
  addressHash?: string;
  renderItemContent: (item: T, index: number, id: number) => React.ReactNode;
}

const ContractMethodsAccordion = <T extends SmartContractMethod>({ data, addressHash, renderItemContent }: Props<T>) => {
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>([]);
  const [ id, setId ] = React.useState(0);

  const handleAccordionStateChange = React.useCallback((newValue: Array<number>) => {
    setExpandedSections(newValue);
  }, []);

  const handleExpandAll = React.useCallback(() => {
    if (!data) {
      return;
    }

    if (expandedSections.length < data.length) {
      setExpandedSections(_range(0, data.length));
    } else {
      setExpandedSections([]);
    }
  }, [ data, expandedSections.length ]);

  const handleReset = React.useCallback(() => {
    setId((id) => id + 1);
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <>
      <Flex mb={ 3 }>
        <Box fontWeight={ 500 }>Contract information</Box>
        <Link onClick={ handleExpandAll } ml="auto">{ expandedSections.length === data.length ? 'Collapse' : 'Expand' } all</Link>
        <Link onClick={ handleReset } ml={ 3 }>Reset</Link>
      </Flex>
      <Accordion allowMultiple position="relative" onChange={ handleAccordionStateChange } index={ expandedSections }>
        { data.map((item, index) => (
          <ContractMethodsAccordionItem
            key={ index }
            data={ item }
            id={ id }
            index={ index }
            addressHash={ addressHash }
            renderContent={ renderItemContent as (item: SmartContractMethod, index: number, id: number) => React.ReactNode }
          />
        )) }
      </Accordion>
    </>
  );
};

export default React.memo(ContractMethodsAccordion) as typeof ContractMethodsAccordion;
