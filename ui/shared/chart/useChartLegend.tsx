import _range from 'lodash/range';
import React from 'react';

export default function useChartLegend(dataLength: number) {
  const [ selectedLines, setSelectedLines ] = React.useState<Array<number>>(_range(dataLength));

  const handleLegendItemClick = React.useCallback((index: number) => {
    const nextSelectedLines = selectedLines.includes(index) ? selectedLines.filter((item) => item !== index) : [ ...selectedLines, index ];
    setSelectedLines(nextSelectedLines);
  }, [ selectedLines ]);

  return {
    selectedLines,
    handleLegendItemClick,
  };
}
