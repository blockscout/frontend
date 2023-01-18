import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { StatsChartInfo, StatsChartsSection } from 'types/api/stats';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';

function isSectionMatches(section: StatsChartsSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: StatsChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

export default function useStats() {
  const { data, isLoading, isError } = useApiQuery('stats_lines');

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ displayedCharts, setDisplayedCharts ] = useState(data?.sections);
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const sectionIds = useMemo(() => data?.sections?.map(({ id }) => id), [ data ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterCharts = useCallback(debounce(q => setFilterQuery(q), 500), []);

  const filterCharts = useCallback((q: string, currentSection: string) => {
    const charts = data?.sections
      ?.map((section) => {
        const charts = section.charts.filter((chart) => isSectionMatches(section, currentSection) && isChartNameMatches(q, chart));

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);

    setDisplayedCharts(charts || []);
  }, [ data ]);

  const handleSectionChange = useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  useEffect(() => {
    filterCharts(filterQuery, currentSection);
  }, [ filterQuery, currentSection, filterCharts ]);

  return React.useMemo(() => ({
    sections: data?.sections,
    sectionIds,
    isLoading,
    isError,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
  }), [
    data,
    sectionIds,
    isLoading,
    isError,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
  ]);
}
