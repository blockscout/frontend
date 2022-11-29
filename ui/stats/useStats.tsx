import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

import type { StatsChart, StatsIntervalIds, StatsSection, StatsSectionIds } from 'types/client/stats';

import { statsChartsScheme } from './constants/charts-scheme';

function isSectionMatches(section: StatsSection, currentSection: StatsSectionIds): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: StatsChart) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

export default function useStats() {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ defaultCharts, setDefaultCharts ] = useState<Array<StatsSection>>();
  const [ displayedCharts, setDisplayedCharts ] = useState<Array<StatsSection>>([]);
  const [ section, setSection ] = useState<StatsSectionIds>('all');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('all');
  const [ filterQuery, setFilterQuery ] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterCharts = useCallback(debounce(q => setFilterQuery(q), 500), []);

  const filterCharts = useCallback((q: string, currentSection: StatsSectionIds) => {
    const charts = defaultCharts
      ?.map((section: StatsSection) => {
        const charts = section.charts.map((chart: StatsChart) => ({
          ...chart,
          visible: isSectionMatches(section, currentSection) && isChartNameMatches(q, chart),
        }));

        return {
          ...section,
          charts,
        };
      });

    setDisplayedCharts(charts || []);
  }, [ defaultCharts ]);

  const handleSectionChange = useCallback((newSection: StatsSectionIds) => {
    setSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  useEffect(() => {
    filterCharts(filterQuery, section);
  }, [ filterQuery, section, filterCharts ]);

  useEffect(() => {
    setDefaultCharts(statsChartsScheme);
    setDisplayedCharts(statsChartsScheme);
    setIsLoading(false);
  }, []);

  return React.useMemo(() => ({
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    isLoading,
    displayedCharts,
  }), [
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
    isLoading,
  ]);
}
