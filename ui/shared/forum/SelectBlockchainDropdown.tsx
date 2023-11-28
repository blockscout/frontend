import { Flex, Icon, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import caretDownIcon from 'icons/arrows/caret-down.svg';
import { useYlide } from 'lib/contexts/ylide';
import { blockchainMeta } from 'lib/contexts/ylide/constants';

export interface SelectBlockchainDropdownProps {
  account?: DomainAccount;
  options?: Array<string>;
  value: string;
  onChange: (newValue: string) => void;
}

export const DEFAULT_CHAINS = [
  'ETHEREUM',
  'AVALANCHE',
  'ARBITRUM',
  'BNBCHAIN',
  'OPTIMISM',
  'POLYGON',
  'FANTOM',
  'KLAYTN',
  'GNOSIS',
  'AURORA',
  'CELO',
  'CRONOS',
  'MOONBEAM',
  'MOONRIVER',
  'METIS',
  'BASE',
  'ZETA',
  'LINEA',
];

const SelectBlockchainDropdown = ({ account, options: _options, value, onChange }: SelectBlockchainDropdownProps) => {
  const options = _options || DEFAULT_CHAINS;
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { balances } = useYlide();

  const hoveredBackgroundColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const clickHandlers = useMemo(() => {
    return options.reduce((acc, option) => {
      acc[option] = () => {
        onChange(option);
        onClose();
      };
      return acc;
    }, {} as Record<string, () => void>);
  }, [ options, onChange, onClose ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Flex onClick={ onToggle } flexDir="row" align="center" cursor="pointer" _hover={{ color: 'link_hovered' }}>
          { value ? (
            <>
			Send via <Text as="span" ml={ 1 } fontWeight="700" color="inherit">{ blockchainMeta[value].title }</Text>
            </>
          ) : (
            <>
			No chain selected
            </>
          ) }  <Icon boxSize={ 3 } ml={ 1 } as={ caretDownIcon }/>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="280px">
        <PopoverBody >
          <VStack align="stretch" gap={ 0 }>
            { options.map((option) => (
              <Flex
                _hover={{ backgroundColor: hoveredBackgroundColor }}
                paddingY={ 1 }
                key={ option }
                borderRadius="5px"
                paddingX={ 1 }
                flexDir="row"
                cursor="pointer"
                onClick={ clickHandlers[option] }
                pointerEvents={ value === option ? 'none' : 'auto' }
                opacity={ value === option ? 0.5 : 1 }
              >
                <Flex grow={ 1 } align="center" flexDir="row">
                  <Flex align="center" justify="center" mr={ 2 } fontSize={ 12 }>{ blockchainMeta[option].logo(16) }</Flex>
                  { blockchainMeta[option].title }{ account ? (
                    ` [${
                      Number((balances[account.account.address]?.[option].numeric || 0).toFixed(2))
                    } ${
                      blockchainMeta[option].ethNetwork.nativeCurrency.symbol
                    }]`
                  ) : null }
                </Flex>
              </Flex>
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBlockchainDropdown;
