import type {
  ListCollection } from '@chakra-ui/react';
import {
  createListCollection,
} from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
import type { FormEventHandler } from 'react';

import { Select, CompactSelect } from '../../toolkit/chakra/select';
import type { SelectOption, SelectProps } from '../../toolkit/chakra/select';
import useNetworkMenu from '../snippets/networkMenu/useNetworkMenu';

export type CompactSelectProps = {
  intent?: SelectProps['intent'];
};

export const useHomeChainSelector = () => {
  const currentUrl = window.location.href;
  const [ activeNetwork, setActiveNetwork ] = React.useState<{ label: string; value: string } | null>(null);
  const [ activeChain, setActiveChain ] = React.useState<{ label: string; value: string } | null>(null);
  const menu = useNetworkMenu();
  const [ networks, setNetworks ] = React.useState<ListCollection<SelectOption<string>> | null>(null);
  const [ chains, setChains ] = React.useState<ListCollection<SelectOption<string>> | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(true);

  const handleNetworkChange = React.useCallback<FormEventHandler<HTMLDivElement>>(() => {}, []);

  const handleChainChange = React.useCallback<FormEventHandler<HTMLDivElement>>((e) => {
    if (chains?.getValues().length === 0) return;

    const target = e.target as HTMLInputElement;
    const selectedOption = chains?.getValues().find((option) => option === target.value);

    if (selectedOption) {
      window.location.href = selectedOption;
    }
  }, [ chains ]);

  React.useEffect(() => {
    const networkItems = menu.data ?? [];
    const networks = Object.values(
      networkItems.reduce((acc, network) => ({
        ...acc,
        [network.group]: {
          label: capitalize(network.group),
          value: network.url,
        },
      }), {} as Record<string, { label: string; value: string }>),
    ).map((network) => ({
      label: network.label,
      value: network.value,
    }));

    if (networkItems && networkItems.length > 0 && !activeChain) {
      const activeChain = networkItems.find((chain) => chain.isActive);
      const [ firstChain ] = networkItems;
      const matchingChain = networkItems.find((chain) => chain.url === currentUrl);

      const activeNetwork = networks.find((network) => network.value === activeChain?.url);
      const [ firstNetwork ] = networks;
      const matchingNetwork = networks.find((network) => network.value === currentUrl);

      if (activeNetwork) {
        setActiveNetwork({ label: activeNetwork.label, value: activeNetwork.value });
      } else if (matchingNetwork) {
        setActiveNetwork({ label: matchingNetwork.label, value: matchingNetwork.value });
      } else if (firstNetwork) {
        setActiveNetwork({ label: firstNetwork.label, value: firstNetwork.value });
      }

      if (currentUrl && matchingChain) {
        setActiveChain({ label: matchingChain.title, value: matchingChain.url });
      } else if (activeChain) {
        setActiveChain({ label: activeChain.title, value: activeChain.url });
      } else if (firstChain) {
        setActiveChain({ label: firstChain.title, value: firstChain.url });
      }

      setNetworks(createListCollection({
        items: networks.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      }));
      setChains(createListCollection({
        items: networkItems.map((option) => ({
          value: option.url,
          label: capitalize(option.title),
        })),
      }));
      setIsLoading(false);
    }
  }, [ currentUrl, setActiveChain, activeChain, setChains, menu, setIsLoading ]);

  React.useEffect(() => {
    if (!chains) {
      menu.onOpenChange({ open: true });
    }
  }, [ chains, menu ]);

  return {
    isLoading,
    networks,
    chains,
    activeNetwork,
    activeChain,
    handleChainChange,
    handleNetworkChange,
  };
};

const HomeChainSelector = () => {
  const { chains, activeChain, handleChainChange } = useHomeChainSelector();

  return chains && (
    <Select
      width="var(--kda-explorer-hero-banner-column-width)"
      onChange={ handleChainChange }
      variant="outline"
      placeholder={ activeChain ? activeChain.label : 'Select Chain' }
      defaultValue={ activeChain?.value ? [ activeChain.value ] : undefined }
      collection={ chains }>
      { chains?.items.map((chain) => (
        <option value={ chain.value } key={ chain.value }>
          { chain.label }
        </option>
      )) }
    </Select>
  );
};

export const CompactNetworkSelector = (props: CompactSelectProps) => {
  const { intent } = props;
  const { networks, activeNetwork, handleNetworkChange } = useHomeChainSelector();

  return networks && (
    <CompactSelect
      size="xs"
      width="var(--kda-explorer-hero-banner-column-width)"
      onChange={ handleNetworkChange }
      variant="outline"
      placeholder={ activeNetwork ? activeNetwork.label : 'Select Network' }
      intent={ intent }
      defaultValue={ activeNetwork?.value ? [ activeNetwork.value ] : undefined }
      collection={ networks }>
      { networks?.items.map((network) => (
        <option value={ network.value } key={ network.value }>
          { network.label }
        </option>
      )) }
    </CompactSelect>
  );
};

export const CompactChainSelector = (props: CompactSelectProps) => {
  const { intent } = props;
  const { chains, activeChain, handleChainChange } = useHomeChainSelector();

  return chains && (
    <CompactSelect
      size="xs"
      width="var(--kda-explorer-hero-banner-column-width)"
      onChange={ handleChainChange }
      variant="outline"
      intent={ intent }
      placeholder={ activeChain ? activeChain.label : 'Select Chain' }
      defaultValue={ activeChain?.value ? [ activeChain.value ] : undefined }
      collection={ chains }>
      { chains?.items.map((chain) => (
        <option value={ chain.value } key={ chain.value }>
          { chain.label }
        </option>
      )) }
    </CompactSelect>
  );
};

export default HomeChainSelector;
