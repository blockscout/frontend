import { Box, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.marketplace;
const dappConfig = feature.isEnabled ? feature.essentialDapps?.revoke : undefined;

type Props = {
  selectedChainId: number;
  changeChain: (value: number) => void;
};

type ChainsConfig = Record<string, { name?: string; icon?: string; iconDark?: string }>;

function ChainIcon({ chain }: { chain: (ChainsConfig[string] & { id: number }) | undefined }) {
  const { colorMode } = useColorMode();
  const placeholder = <IconSvg name="networks/icon-placeholder" boxSize={ 5 } color="text.secondary"/>;

  if (!chain) {
    return placeholder;
  }

  let src = colorMode === 'dark' ? (chain.iconDark || chain.icon) : chain.icon;

  if (!src && chain.id === 1) {
    src = '/static/ethereum.svg';
  }

  return <Image src={ src } alt={ chain.name } boxSize={ 5 } fallback={ placeholder }/>;
}

export default function ChainSelect({ selectedChainId, changeChain }: Props) {
  const { open, onOpenChange } = useDisclosure();

  const chainsQuery = useQuery({
    queryKey: [ 'revoke:chains' ],
    queryFn: async() => {
      try {
        const response = await fetch('/assets/essential-dapps/chains.json');
        const data = await response.json() as ChainsConfig;
        if (!dappConfig?.chains || !data) {
          return [];
        }
        return dappConfig.chains.map(
          (id) => data[id] ? ({
            id: Number(id),
            name: data[id].name,
            icon: data[id].icon,
            iconDark: data[id].iconDark,
          }) : undefined,
        ).filter(Boolean);
      } catch {
        return [];
      }
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
          px={ 2 }
          bgColor={{ _light: 'white', _dark: 'transparent' }}
          flex={ 1 }
          justifyContent="flex-start"
        >
          <ChainIcon chain={ selectedChain }/>
          <Text>{ selectedChain?.name }</Text>
          <IconSvg
            name="arrows/east-mini"
            transform={ open ? 'rotate(90deg)' : 'rotate(-90deg)' }
            transitionDuration="faster"
            boxSize={ 5 }
            color="text.secondary"
            ml="auto"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="fit-content"
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
              <ChainIcon chain={ chain }/>
              <Text fontSize="sm" fontWeight="500">
                { chain.name }
              </Text>
              { selectedChain?.id === chain.id && (
                <IconSvg name="check" boxSize={ 5 } ml="auto" color="text.secondary"/>
              ) }
            </Box>
          )) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
