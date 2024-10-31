import { Accordion, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from './types';

import { route } from 'nextjs-routes';

import { apos } from 'lib/html-entities';
import LinkInternal from 'ui/shared/links/LinkInternal';

import ContractAbiItem from './ContractAbiItem';
import useFormSubmit from './useFormSubmit';
import useScrollToMethod from './useScrollToMethod';

interface Props {
  abi: Array<SmartContractMethod>;
  visibleItems?: Array<number>;
  addressHash: string;
  tab: string;
  sourceAddress?: string;
}

const ContractAbi = ({ abi, addressHash, sourceAddress, tab, visibleItems }: Props) => {
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

  const hasVisibleItems = !visibleItems || visibleItems.length > 0;

  return (
    <div>
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
            id={ id }
            index={ index }
            data={ item }
            isVisible={ !visibleItems || visibleItems.includes(index) }
            addressHash={ addressHash }
            sourceAddress={ sourceAddress }
            tab={ tab }
            onSubmit={ handleFormSubmit }
          />
        )) }
      </Accordion>
      { !hasVisibleItems && (
        <div>
          <div>Couldn{ apos }t find any method that matches your query.</div>
          <div>
            You can use custom ABI for this contract without verifying the contract in the{ ' ' }
            <LinkInternal
              href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'read_write_custom_methods' } }) }
              scroll={ false }
            >
              Custom ABI
            </LinkInternal>
            { ' ' }tab.
          </div>
        </div>
      ) }
    </div>
  );
};

export default React.memo(ContractAbi);
