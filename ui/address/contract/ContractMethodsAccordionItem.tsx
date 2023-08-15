import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Icon, Tooltip, useClipboard, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { Element } from 'react-scroll';

import type { SmartContractMethod } from 'types/api/contract';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import iconLink from 'icons/link.svg';
import Hint from 'ui/shared/Hint';

interface Props<T extends SmartContractMethod> {
  data: T;
  index: number;
  id: number;
  addressHash?: string;
  renderContent: (item: T, index: number, id: number) => React.ReactNode;
}

const ContractMethodsAccordionItem = <T extends SmartContractMethod>({ data, index, id, addressHash, renderContent }: Props<T>) => {
  const url = React.useMemo(() => {
    if (!('method_id' in data)) {
      return '';
    }

    return config.app.baseUrl + route({
      pathname: '/address/[hash]',
      query: {
        hash: addressHash ?? '',
        tab: 'read_contract',
      },
      hash: data.method_id,
    });
  }, [ addressHash, data ]);

  const { hasCopied, onCopy } = useClipboard(url, 1000);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCopyLinkClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onCopy();
  }, [ onCopy ]);

  return (
    <AccordionItem as="section" _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }}>
      <Element as="h2" name={ 'method_id' in data ? `method_${ data.method_id }` : '' }>
        <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }} wordBreak="break-all" textAlign="left">
          { 'method_id' in data && (
            <Tooltip label={ hasCopied ? 'Copied!' : 'Copy link' } isOpen={ isOpen || hasCopied } onClose={ onClose }>
              <Box
                boxSize={ 5 }
                color="text_secondary"
                _hover={{ color: 'link_hovered' }}
                mr={ 2 }
                onClick={ handleCopyLinkClick }
                onMouseEnter={ onOpen }
                onMouseLeave={ onClose }
              >
                <Icon as={ iconLink } boxSize={ 5 }/>
              </Box>
            </Tooltip>
          ) }
          <Box as="span" fontWeight={ 500 } mr={ 1 }>
            { index + 1 }. { data.type === 'fallback' || data.type === 'receive' ? data.type : data.name }
          </Box>
          { data.type === 'fallback' && (
            <Hint
              label={
                `The fallback function is executed on a call to the contract if none of the other functions match 
                    the given function signature, or if no data was supplied at all and there is no receive Ether function. 
                    The fallback function always receives data, but in order to also receive Ether it must be marked payable.`
              }/>
          ) }
          { data.type === 'receive' && (
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
      </Element>
      <AccordionPanel pb={ 4 } px={ 0 }>
        { renderContent(data, index, id) }
      </AccordionPanel>
    </AccordionItem>
  );
};

export default React.memo(ContractMethodsAccordionItem);
