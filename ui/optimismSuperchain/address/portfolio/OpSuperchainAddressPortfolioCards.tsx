import { type LinkProps } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { CollapsibleList } from 'toolkit/chakra/collapsible';

import OpSuperchainAddressPortfolioCard from './OpSuperchainAddressPortfolioCard';

const TRIGGER_TEXT: [string, string] = [ '+ show more', '- show less' ];
const TRIGGER_PROPS: LinkProps = {
  variant: 'secondary',
  w: '100%',
};

interface Props {
  isLoading: boolean;
  selectedChainId: string | null;
  onChange: (chainId: string) => void;
  chainValues: multichain.AddressPortfolio['chain_values'];
  totalValue?: string;
}

const OpSuperchainAddressPortfolioCards = ({ isLoading, selectedChainId, onChange, chainValues, totalValue }: Props) => {

  const [ initialActiveIndex, setInitialActiveIndex ] = React.useState<number | undefined>(undefined);

  const chains = multichainConfig()?.chains;

  const isMobile = useIsMobile();

  const cutLength = isMobile ? 6 : 10;

  const items = React.useMemo(() => {
    const totalValueBn = BigNumber(totalValue ?? '0');
    return chainValues ?
      Object.entries(chainValues)
        .map(([ chainId, value ]) => {
          const chain = chains?.find((chain) => chain.id === chainId);
          if (!chain) {
            return null;
          }

          const valueBn = BigNumber(value);
          return {
            chain,
            value: valueBn,
            share: totalValueBn.gt(0) ? valueBn.div(totalValueBn).toNumber() : undefined,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.value.minus(a.value).toNumber()) :
      [];
  }, [ chainValues, chains, totalValue ]);

  React.useEffect(() => {
    if (!isLoading && selectedChainId !== null) {
      const activeIndex = items.findIndex((item) => item.chain.id === selectedChainId);
      setInitialActiveIndex((prev) => prev === undefined ? activeIndex : prev);
    }

  }, [ isLoading, items, selectedChainId ]);

  const renderItem = React.useCallback((item: typeof items[number]) => {
    return (
      <OpSuperchainAddressPortfolioCard
        key={ item.chain.id }
        chain={ item.chain }
        value={ item.value }
        share={ item.share }
        loading={ isLoading }
        selected={ selectedChainId === item.chain.id }
        noneSelected={ selectedChainId === null }
        totalNum={ items.length }
        onClick={ items.length > 1 ? onChange : undefined }
      />
    );
  }, [ isLoading, selectedChainId, onChange, items ]);

  if (items.length === 0) {
    return null;
  }

  return (
    <CollapsibleList
      items={ items }
      renderItem={ renderItem }
      cutLength={ cutLength }
      text={ TRIGGER_TEXT }
      triggerProps={ TRIGGER_PROPS }
      defaultExpanded={ initialActiveIndex !== undefined ? initialActiveIndex > cutLength : undefined }
      flexDir="row"
      alignItems="center"
      gap={ 2 }
      flexWrap="wrap"
      mt={ 2 }
      mb={ 6 }
    />
  );
};

export default React.memo(OpSuperchainAddressPortfolioCards);
