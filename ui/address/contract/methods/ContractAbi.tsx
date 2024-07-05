import { Accordion, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from './types';

import ContractAbiItem from './ContractAbiItem';
import useFormSubmit from './useFormSubmit';
import useScrollToMethod from './useScrollToMethod';

interface Props {
  abi: Array<SmartContractMethod>;
  addressHash: string;
  tab: string;
}

const ContractAbi = ({ abi, addressHash, tab }: Props) => {
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>(abi.length === 1 ? [ 0 ] : []);
  const [ id, setId ] = React.useState(0);

  useScrollToMethod(abi, setExpandedSections);

  const handleFormSubmit = useFormSubmit({ addressHash });

  const handleAccordionStateChange = React.useCallback((newValue: Array<number>) => {
    setExpandedSections(newValue);
  }, []);

  const handleExpandAll = React.useCallback(() => {
    if (!abi) {
      return;
    }

    if (expandedSections.length < abi.length) {
      setExpandedSections(_range(0, abi.length));
    } else {
      setExpandedSections([]);
    }
  }, [ abi, expandedSections.length ]);

  const handleReset = React.useCallback(() => {
    setId((id) => id + 1);
  }, []);

  return (
    <>
      <Flex mb={ 3 }>
        <Box fontWeight={ 500 } mr="auto">Contract information</Box>
        { abi.length > 1 && (
          <Link onClick={ handleExpandAll }>
            { expandedSections.length === abi.length ? 'Collapse' : 'Expand' } all
          </Link>
        ) }
        <Link onClick={ handleReset } ml={ 3 }>Reset</Link>
      </Flex>
      <Accordion allowMultiple position="relative" onChange={ handleAccordionStateChange } index={ expandedSections }>
        { abi.map((item, index) => (
          <ContractAbiItem
            key={ index }
            data={ item }
            id={ id }
            index={ index }
            addressHash={ addressHash }
            tab={ tab }
            onSubmit={ handleFormSubmit }
          />
        )) }
      </Accordion>
    </>
  );
};

export default React.memo(ContractAbi);
