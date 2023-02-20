import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from 'types/api/contract';

import Hint from 'ui/shared/Hint';

interface Props<T extends SmartContractMethod> {
  data: Array<T>;
  renderContent: (item: T, index: number, id: number) => React.ReactNode;
}

const ContractMethodsAccordion = <T extends SmartContractMethod>({ data, renderContent }: Props<T>) => {
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
        { data.map((item, index) => {
          return (
            <AccordionItem key={ index } as="section" _first={{ borderTopWidth: '0' }}>
              <h2>
                <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }} wordBreak="break-all" textAlign="left">
                  <Box as="span" fontWeight={ 500 } mr={ 1 }>
                    { index + 1 }. { item.type === 'fallback' || item.type === 'receive' ? item.type : item.name }
                  </Box>
                  { item.type === 'fallback' && (
                    <Hint
                      label={
                        `The fallback function is executed on a call to the contract if none of the other functions match 
                        the given function signature, or if no data was supplied at all and there is no receive Ether function. 
                        The fallback function always receives data, but in order to also receive Ether it must be marked payable.`
                      }/>
                  ) }
                  { item.type === 'receive' && (
                    <Hint
                      label={
                        `The receive function is executed on a call to the contract with empty calldata. 
                        This is the function that is executed on plain Ether transfers (e.g. via .send() or .transfer()). 
                        If no such function exists, but a payable fallback function exists, the fallback function will be called on a plain Ether transfer. 
                        If neither a receive Ether nor a payable fallback function is present, 
                        the contract cannot receive Ether through regular transactions and throws an exception.`
                      }/>
                  ) }
                  <AccordionIcon/>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={ 4 } px={ 0 }>
                { renderContent(item, index, id) }
              </AccordionPanel>
            </AccordionItem>
          );
        }) }
      </Accordion>
    </>
  );
};

export default React.memo(ContractMethodsAccordion) as typeof ContractMethodsAccordion;
