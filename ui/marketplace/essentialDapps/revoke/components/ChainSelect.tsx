import { Box, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import { Button } from 'toolkit/chakra/button';
import { Image } from 'toolkit/chakra/image';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  selectedChainId: number;
  changeChain: (value: number) => void;
};

const CHAIN_IDS = [ 1, 100, 30, 11155111 ];

export default function ChainSelect({ selectedChainId, changeChain }: Props) {
  const { open, onOpenChange } = useDisclosure();

  const chainsQuery = useQuery({
    queryKey: [ 'revoke:chains' ],
    queryFn: async() => {
      const chains = await Promise.all(CHAIN_IDS.map(async(id) => {
        const response = await fetch(`https://chains.blockscout.com/api/chains/${ id }`);
        const data = await response.json() as { name: string; logo: string };

        return {
          id,
          name: data.name,
          logoUrl: data.logo,
        };
      }));

      return chains;
    },
    placeholderData: [],
  });

  const handleChange = useCallback((event: React.MouseEvent) => {
    const id = Number((event.currentTarget as HTMLDivElement).getAttribute('data-id'));
    changeChain(id);
    onOpenChange({ open: false });
  },
  [ changeChain, onOpenChange ]);

  const selectedChain = chainsQuery.data?.find((chain) => chain.id === selectedChainId);

  return (
    <PopoverRoot open={ open } onOpenChange={ onOpenChange } positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        <Button
          variant="dropdown"
          colorScheme="gray"
          size="sm"
          expanded={ open }
          loading={ !selectedChain }
          loadingText="Network"
        >
          <Image src={ selectedChain?.logoUrl } alt={ selectedChain?.name }/>
          <Box hideBelow="md" ml={ 1 }>
            { selectedChain?.name }
          </Box>
          <IconSvg name="arrows/east-mini" transform={ open ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="fit-content"
        // mx={{ base: 3, md: 0 }}
        minW="200px"
        maxH="300px"
        overflowY="scroll"
      >
        <PopoverBody p={ 2 } display="flex" flexDir="column">
          { chainsQuery.data?.map((chain) => (
            <Box
              key={ chain.id }
              data-id={ chain.id }
              p={ 2 }
              borderRadius="base"
              cursor="pointer"
              display="flex"
              gap={ 2 }
              alignItems="center"
              _hover={{
                bgColor: 'selected.control.bg',
              }}
              onClick={ handleChange }
            >
              <Image src={ chain.logoUrl } alt={ chain.name }/>
              <Text fontSize="sm" fontWeight="500">
                { chain.name }
              </Text>
              { selectedChain?.id === chain.id && (
                <IconSvg name="check" boxSize={ 5 } ml="auto" color="gray.500"/>
              ) }
            </Box>
          )) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
