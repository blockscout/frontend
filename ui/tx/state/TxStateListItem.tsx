import { AccordionItem, AccordionButton, AccordionIcon, Button, Flex, Text, Link, StatArrow, Stat, AccordionPanel } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { data } from 'data/txState';
import { nbsp } from 'lib/html-entities';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TextSeparator from 'ui/shared/TextSeparator';

import TxStateStorageItem from './TxStateStorageItem';

type Props = ArrayElement<typeof data>;

const TxStateListItem = ({ storage, address, miner, after, before, diff }: Props) => {
  const hasStorageData = Boolean(storage?.length);

  return (
    <AccountListItemMobile>
      <AccordionItem isDisabled={ !hasStorageData } border={ 0 } w="100%" display="flex" flexDirection="column" rowGap={ 3 }>
        { ({ isExpanded }) => (
          <>
            <Flex>
              <Address flexGrow={ 1 }>
                <AddressIcon hash={ address }/>
                <AddressLink hash={ address } fontWeight="500" ml={ 2 }/>
              </Address>
              <AccordionButton
                _hover={{ background: 'unset' }}
                padding="0"
                ml={ 4 }
                w="auto"
              >
                <Button
                  variant="outline"
                  borderWidth="1px"
                  // button can't be inside button (AccordionButton)
                  as="div"
                  isActive={ isExpanded }
                  size="sm"
                  fontWeight={ 400 }
                  isDisabled={ !hasStorageData }
                  colorScheme="gray"
                  // AccordionButton has its own opacity rule when disabled
                  _disabled={{ opacity: 1 }}
                >
                  { storage?.length || '0' }
                </Button>
                <AccordionIcon color="blue.600" width="30px"/>
              </AccordionButton>
            </Flex>
            <Flex rowGap={ 2 } flexDir="column" fontSize="sm">
              <Text fontWeight={ 600 }>Miner</Text>
              <Link>{ miner }</Link>
            </Flex>
            <Flex rowGap={ 2 } flexDir="column" fontSize="sm">
              <Text fontWeight={ 600 }>Before</Text>
              <Flex>
                <Text>{ before.balance } ETH</Text>
                <TextSeparator/>
                { typeof before.nonce !== 'undefined' && <Text>Nonce:{ nbsp }{ before.nonce }</Text> }
              </Flex>
            </Flex>
            <Flex rowGap={ 2 } flexDir="column" fontSize="sm">
              <Text fontWeight={ 600 }>After</Text>
              <Text>{ after.balance } ETH</Text>
              { typeof after.nonce !== 'undefined' && <Text>Nonce:{ nbsp }{ after.nonce }</Text> }
            </Flex>
            <Flex rowGap={ 2 } flexDir="column" fontSize="sm">
              <Text fontWeight={ 600 }>State difference</Text>
              <Stat>
                { diff } ETH
                <StatArrow ml={ 2 } type={ Number(diff) > 0 ? 'increase' : 'decrease' }/>
              </Stat>
            </Flex>
            { hasStorageData && (
              <AccordionPanel fontWeight={ 500 } p={ 0 }>
                { storage?.map((storageItem, index) => <TxStateStorageItem key={ index } storageItem={ storageItem }/>) }
              </AccordionPanel>
            ) }
          </>
        ) }
      </AccordionItem>
    </AccountListItemMobile>
  );
};

export default TxStateListItem;
