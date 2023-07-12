import { Accordion, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';
import { scroller, Element } from 'react-scroll';

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

  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      return;
    }

    const index = data.findIndex((item) => 'method_id' in item && item.method_id === hash);
    if (index) {
      scroller.scrollTo(`method_${ hash }`, {
        duration: 500,
        smooth: true,
        offset: -100,
      });
      setExpandedSections([ index ]);
    }
  }, [ data ]);

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
          <Element key={ index } name={ 'method_id' in item ? `method_${ item.method_id }` : '' }>
            <ContractMethodsAccordionItem
              data={ item }
              id={ id }
              index={ index }
              addressHash={ addressHash }
              renderContent={ renderItemContent as (item: SmartContractMethod, index: number, id: number) => React.ReactNode }
            />
          </Element>
        )) }
      </Accordion>
    </>
  );
};

export default React.memo(ContractMethodsAccordion) as typeof ContractMethodsAccordion;
