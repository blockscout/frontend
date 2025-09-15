import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption, SelectProps, ViewMode } from 'toolkit/chakra/select';
import ChainIcon from 'ui/optimismSuperchain/components/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends Omit<SelectProps, 'collection' | 'placeholder'> {
  loading?: boolean;
  mode?: ViewMode;
  chainIds?: Array<string>;
  withAllOption?: boolean;
}

const ChainSelect = ({ loading, mode, chainIds, withAllOption, ...props }: Props) => {
  const isInitialLoading = useIsInitialLoading(loading);
  const isMobile = useIsMobile();

  const collection = React.useMemo(() => {

    const chainItems = multichainConfig()?.chains
      .filter((chain) => !chainIds || (chain.config.chain.id && chainIds.includes(chain.config.chain.id)))
      .map((chain) => ({
        value: chain.slug,
        label: chain.config.chain.name || chain.slug,
        icon: <ChainIcon data={ chain } alt={ chain.config.chain.name }/>,
      })) || [];
    const allOption = withAllOption ? {
      value: 'all',
      label: 'All chains',
      icon: <IconSvg name="apps_slim" boxSize={ 5 }/>,
    } : null;

    const items = [ allOption, ...chainItems ].filter(Boolean);

    return createListCollection<SelectOption>({ items });
  }, [ chainIds, withAllOption ]);

  return (
    <Select
      collection={ collection }
      defaultValue={ [ collection.items[0].value ] }
      placeholder="Select chain"
      loading={ isInitialLoading }
      mode={ isMobile && !mode ? 'compact' : mode }
      w="fit-content"
      flexShrink={ 0 }
      { ...props }
    />
  );
};

export default React.memo(ChainSelect);
