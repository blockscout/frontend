import { Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractConflictingImplementation } from 'types/api/contract';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from 'toolkit/chakra/button';
import { DialogActionTrigger, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTrigger } from 'toolkit/chakra/dialog';
import { Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: Array<SmartContractConflictingImplementation>;
  children: React.ReactNode;
}

const ConflictingImplementationsModal = ({ data, children }: Props) => {
  const isMobile = useIsMobile();

  return (
    <DialogRoot size={{ lgDown: 'full', lg: 'md' }}>
      <DialogTrigger>
        { children }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Detected proxy implementations</DialogHeader>
        <DialogBody>
          <Text>
            Multiple proxy patterns were detected for this contract.
            This may be due to an unsupported custom proxy design or due to a malicious proxy spoofing attempt.
            Review carefully.
          </Text>
          <VStack alignItems="stretch" mt={ 6 } textStyle="sm">
            { data.map((item) => (
              <Grid
                key={ item.proxy_type }
                templateColumns="80px 1fr"
                p={ 4 }
                columnGap={ 5 }
                rowGap={ 2 }
                borderRadius="md"
                bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
              >
                <GridItem>Proxy type:</GridItem>
                <GridItem>{ item.proxy_type }</GridItem>
                <GridItem>Address:</GridItem>
                <GridItem>
                  <VStack alignItems="stretch">
                    { item.implementations.map((implementation) => (
                      <AddressEntity
                        key={ implementation.address_hash }
                        address={{ hash: implementation.address_hash, name: implementation.name }}
                        truncation={ isMobile ? 'constant' : 'none' }
                      />
                    )) }
                  </VStack>
                </GridItem>
              </Grid>
            )) }
          </VStack>
          <HStack mt={ 6 } gap={ 6 }>
            <DialogActionTrigger asChild>
              <Button>Got it, thanks</Button>
            </DialogActionTrigger>
            <Link external noIcon href="https://discord.com/invite/blockscout">
              Contact us
            </Link>
          </HStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(ConflictingImplementationsModal);
