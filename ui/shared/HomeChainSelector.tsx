import type {
  ListCollection } from '@chakra-ui/react';
import {
  createListCollection,
} from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
import type { FormEventHandler } from 'react';

import type { FeaturedNetwork } from '../../types/networks';

import config from 'configs/app';

import { Select, CompactSelect, InlineSelect } from '../../toolkit/chakra/select';
import type { SelectOption, SelectProps } from '../../toolkit/chakra/select';
import { useNetworkMenu } from '../snippets/networkMenu/useNetworkMenu';

export type CompactSelectProps = {
  intent?: SelectProps['intent'];
};

export const useHomeChainSelector = () => {
  const currentUrl = window.location.href;
  const [ activeNetwork, setActiveNetwork ] = React.useState<{ label: string; value: FeaturedNetwork['group'] } | null>(null);
  const [ activeChain, setActiveChain ] = React.useState<{ label: string; value: string } | null>(null);
  const networkMenu = useNetworkMenu();
  const [ networks, setNetworks ] = React.useState<ListCollection<SelectOption<string>> | null>(null);
  const [ chains, setChains ] = React.useState<ListCollection<SelectOption<string>> | null>(null);
  const [ filteredNetwork, setFilteredNetwork ] = React.useState<FeaturedNetwork['group'] | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(true);

  const handleNetworkChange = React.useCallback<FormEventHandler<HTMLDivElement>>((e) => {
    const target = e.target as HTMLInputElement;
    const selectedOption = networkMenu.data?.find((option) => option.group === target.value);

    if (selectedOption) {
      setActiveNetwork({ label: capitalize(selectedOption.title), value: selectedOption.group });
    }
  }, [ networkMenu.data ]);

  const handleChainChange = React.useCallback<FormEventHandler<HTMLDivElement>>((e) => {
    if (chains?.getValues().length === 0) return;

    const target = e.target as HTMLInputElement;
    const selectedOption = chains?.getValues().find((option) => option === target.value);

    if (selectedOption) {
      window.location.href = selectedOption;
    }
  }, [ chains ]);

  React.useEffect(() => {
    const networkItems = networkMenu.data ?? [];
    const _networks = Object.values(
      networkItems.reduce((acc, network) => ({
        ...acc,
        [network.group]: {
          label: capitalize(network.group) as string,
          value: network.group,
        },
      }), {} as Record<string, { label: string; value: string }>),
    ).map((network) => ({
      label: network.label,
      value: network.value,
    }));

    if (networkItems && networkItems.length > 0 && !activeNetwork) {
      let currentNetwork = networkItems.find((network) => currentUrl.includes(network.group));

      currentNetwork ??= networkItems.find((network) => network.group === config.UI.navigation.baseNetwork) ?? networkItems[0];

      setActiveNetwork({ label: capitalize(currentNetwork.title), value: currentNetwork.group });
      setNetworks(createListCollection({
        items: _networks,
      }));
      setIsLoading(false);
    }
  }, [ currentUrl, activeNetwork, networkMenu, setIsLoading ]);

  React.useEffect(() => {
    const chainItems = networkMenu.data ?? [];

    if (chainItems && chainItems.length > 0 && !activeChain && activeNetwork) {
      const _chains = chainItems.filter((chain) => chain.group === activeNetwork?.value).map((chain) => ({
        label: capitalize(chain.title),
        value: chain.url,
      }));

      let currentChain = _chains.find((chain) => chain.value === currentUrl);

      if (!currentChain) {
        const availableChains = _chains.filter((chain) => chain);
        currentChain = _chains.find((chain) => chain.value.includes(`chain-${ config.UI.navigation.baseChain }`)) ?? availableChains[0];
      }

      if (currentChain && !currentUrl.startsWith(currentChain.value)) {
        window.location.href = currentChain.value;
        return;
      }

      setActiveChain({ label: capitalize(currentChain.label), value: currentChain.value });
      setChains(createListCollection({
        items: _chains.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      }));
      setIsLoading(false);
      setFilteredNetwork(activeNetwork.value);
    }
  }, [ currentUrl, activeNetwork, activeChain, networkMenu, setIsLoading ]);

  React.useEffect(() => {
    if (!chains) {
      networkMenu.onOpenChange({ open: true });
    }
  }, [ chains, networkMenu ]);

  React.useEffect(() => {
    if (networkMenu?.data && activeNetwork && activeChain && filteredNetwork !== activeNetwork.value) {
      const chainItems = networkMenu.data ?? [];
      const chains = chainItems.filter((chain) => chain.group === activeNetwork.value).map((chain) => ({
        label: capitalize(chain.title),
        value: chain.url,
      }));
      setChains(createListCollection({
        items: chains.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      }));
      setActiveChain(null);
    }
  }, [ activeChain, activeNetwork, filteredNetwork, setChains, networkMenu.data ]);

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

export const InlineChainSelector = () => {
  const { chains, activeChain, handleChainChange } = useHomeChainSelector();

  return chains && (
    <InlineSelect
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
    </InlineSelect>
  );
};

export default HomeChainSelector;
