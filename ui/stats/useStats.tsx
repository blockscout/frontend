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
  const [ displayedCharts, setDisplayedCharts ] = useState<Array<StatsSection>>(statsChartsScheme);
  const [ section, setSection ] = useState<StatsSectionIds>('all');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('all');
  const [ filterQuery, setFilterQuery ] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterCharts = useCallback(debounce(q => setFilterQuery(q), 500), []);

  const filterCharts = useCallback((q: string, currentSection: StatsSectionIds) => {
    const charts = statsChartsScheme
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
  }, []);

  const handleSectionChange = useCallback((newSection: StatsSectionIds) => {
    setSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  useEffect(() => {
    filterCharts(filterQuery, section);
  }, [ filterQuery, section, filterCharts ]);

  return React.useMemo(() => ({
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
  }), [
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
  ]);
}
