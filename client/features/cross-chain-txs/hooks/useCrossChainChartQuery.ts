import { pickBy, uniqBy } from 'es-toolkit';

import type { ChartDataPayloadSankey, StatsIntervalIds } from 'client/features/chain-stats/types/client';

import { getDatesFromInterval } from 'client/features/chain-stats/utils/interval';
import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { isAllOption } from 'ui/shared/externalChains/ChainSelect';

import { CROSS_CHAIN_TXS_CHART } from '../stubs/chain-stats';
import { CROSS_CHAIN_TXS_CHARTS } from '../utils/chain-stats';

interface Props {
  id: string;
  interval: StatsIntervalIds;
  enabled?: boolean;
  counterPartyChainIds?: Array<string>;
}

export default function useCrossChainChartQuery({ id, interval, enabled = true, counterPartyChainIds }: Props) {

  const chart = CROSS_CHAIN_TXS_CHARTS.find((chart) => chart.id === id) ?? CROSS_CHAIN_TXS_CHARTS[0];
  const { start: startDate, end: endDate } = getDatesFromInterval(interval);

  const resourceName = chart.resourceName;

  return useApiQuery<typeof resourceName, unknown, ChartDataPayloadSankey>(resourceName, {
    pathParams: { chainId: config.chain.id },
    queryParams: pickBy({
      from: startDate,
      to: endDate,
      counterparty_chain_ids: isAllOption(counterPartyChainIds) ? undefined : counterPartyChainIds,
    }, (value) => value !== undefined),
    queryOptions: {
      enabled: enabled && CROSS_CHAIN_TXS_CHARTS.some((chart) => chart.id === id),
      refetchOnMount: false,
      placeholderData: (prevData) => {
        return prevData ?? CROSS_CHAIN_TXS_CHART;
      },
      select: (data) => {
        const chains = uniqBy(data.items.flatMap((item) => [ item.source_chain, item.destination_chain ]).filter(Boolean), (chain) => chain?.id);

        return {
          info: {
            title: chart.title,
            description: chart.description,
            id: id,
            resolutions: [],
          },
          type: 'sankey',
          data: {
            nodes: chains.map((chain) => ({ id: chain.id, name: chain.name })),
            links: data.items
              .map((item) => {
                if (!item.source_chain?.id || !item.destination_chain?.id) {
                  return null;
                }
                return { source: item.source_chain.id, target: item.destination_chain.id, value: item.messages_count };
              })
              .filter(Boolean),
          },
        };
      },
    },
  });
}
