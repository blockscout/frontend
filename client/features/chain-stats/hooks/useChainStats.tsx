import { uniqBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { ChainStatsChart, ChainStatsPayload, ChainStatsSection, StatsIntervalIds } from '../types/client';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import { CHAIN_STATS_CHARTS } from '../stubs/charts';
import { CROSS_CHAIN_TXS_SECTIONS } from '../utils/additional-charts';

function isSectionMatches(section: ChainStatsSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: ChainStatsChart) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

interface Props {
  chain?: ClusterChainConfig;
}

export default function useChainStats({ chain }: Props = {}) {
  const router = useRouter();

  const [ sectionId, setSectionId ] = React.useState('all');
  const [ filterQuery, setFilterQuery ] = React.useState('');
  const [ initialFilterQuery, setInitialFilterQuery ] = React.useState('');
  const [ interval, setInterval ] = React.useState<StatsIntervalIds>('oneMonth');

  const { data, isPlaceholderData, isError } = useApiQuery<'stats:lines', unknown, ChainStatsPayload>('stats:lines', {
    queryOptions: {
      placeholderData: CHAIN_STATS_CHARTS,
      select: (data) => {
        const crossChainTxsFeature = (chain?.app_config || config).features.crossChainTxs;
        if (!crossChainTxsFeature.isEnabled) {
          return data;
        }

        const sections: Array<ChainStatsSection> = data.sections.slice();

        for (const extraSection of CROSS_CHAIN_TXS_SECTIONS) {
          const existingSection = sections.find((section) => section.id === extraSection.id);
          if (existingSection) {
            existingSection.charts = uniqBy([
              ...existingSection.charts,
              ...extraSection.charts,
            ], (chart) => chart.id);
          } else {
            sections.push(extraSection);
          }
        }

        return {
          sections,
        };
      },
    },
    chain,
  });

  React.useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const chartId = getQueryParamString(router.query.chartId);
      const chartName = data?.sections.map((section) => section.charts.find((chart) => chart.id === chartId)).filter(Boolean)[0]?.title;
      if (chartName) {
        setInitialFilterQuery(chartName);
        setFilterQuery(chartName);
        router.replace({ pathname: '/stats' }, undefined, { scroll: false });
      }
    }
  // run only when data is loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const displayedSections = React.useMemo(() => {
    return data?.sections
      ?.map((section) => {
        const charts = section.charts.filter((chart) => isSectionMatches(section, sectionId) && isChartNameMatches(filterQuery, chart));

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);
  }, [ sectionId, data?.sections, filterQuery ]);

  return React.useMemo(() => ({
    sections: data?.sections,
    displayedSections,
    sectionId,

    isLoading: isPlaceholderData,
    isError,

    initialFilterQuery,
    filterQuery,

    interval,

    onFilterChange: setFilterQuery,
    onSectionChange: setSectionId,
    onIntervalChange: setInterval,
  }), [ data?.sections, displayedSections, sectionId, isPlaceholderData, isError, initialFilterQuery, filterQuery, interval ]);
}
