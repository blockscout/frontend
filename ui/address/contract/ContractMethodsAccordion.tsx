import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Icon, Link, Tooltip } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from 'types/api/contract';

import infoIcon from 'icons/info.svg';

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

  return (
    <Accordion allowMultiple position="relative" onChange={ handleAccordionStateChange } index={ expandedSections }>
      { data.map((item, index) => {
        return (
          <AccordionItem key={ index } as="section">
            <h2>
              <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }}>
                <Box as="span" fontFamily="heading" fontWeight={ 500 } fontSize="lg" mr={ 1 }>
                  { index + 1 }. { item.type === 'fallback' ? 'fallback' : item.name }
                </Box>
                { item.type === 'fallback' && (
                  <Tooltip
                    label={ `The fallback function is executed on a call to the contract if none of the other functions match 
                    the given function signature, or if no data was supplied at all and there is no receive Ether function. 
                    The fallback function always receives data, but in order to also receive Ether it must be marked payable.` }
                    placement="top"
                    maxW="320px"
                  >
                    <Box cursor="pointer" display="inherit">
                      <Icon as={ infoIcon } boxSize={ 5 }/>
                    </Box>
                  </Tooltip>
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
      <Flex columnGap={ 3 } position="absolute" top={ 0 } right={ 0 } py={ 3 } lineHeight="27px">
        <Link onClick={ handleExpandAll }>{ expandedSections.length === data.length ? 'Collapse' : 'Expand' } all</Link>
        <Link onClick={ handleReset }>Reset</Link>
      </Flex>
    </Accordion>
  );
};

export default React.memo(ContractMethodsAccordion) as typeof ContractMethodsAccordion;
