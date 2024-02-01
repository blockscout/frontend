import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
const InfoBlock = () => {
  const poolInfo: Array<{ title: string; description: string }> = [
    {
      title: '29,152 pool members are actively bonding in pools.',
      description: 'The total number of accounts that have joined a pool.',
    },
    {
      title: '14,050,812 DOT is currently bonded in pools.',
      description: 'The total DOT currently bonded in nomination pools.',
    },
    {
      title: '742,190,826 DOT is currently being staked on Polkadot.',
      description:
				'The total DOT currently being staked amongst all validators and nominators.',
    },
  ];

  return (
    <Flex
      direction={{ base: 'row', lg: 'column' }}
      flexWrap={{ base: 'wrap', lg: 'wrap' }}
      justifyContent={{ base: 'flex-start', lg: 'flex-start' }}
      // marginTop={24}
      gap={ 8 }
    >
      { poolInfo.map((elem, index) => (
        <Box key={ index } flex={{ base: '0 0 100%', lg: '0 0 100%' }}>
          <div>
            <strong>{ elem.title }</strong>
          </div>
          <div>{ elem.description }</div>
        </Box>
      )) }
    </Flex>
  );
};

export default InfoBlock;
