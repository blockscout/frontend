import type { FlexProps } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ChartContentProps } from '../components/ChartContent';
import { ChartWidgetRoot, ChartWidgetHeader } from '../components/ChartWidget';
import { SankeyChartMenu } from './parts/SankeyChartMenu';
import type { SankeyChartProps } from './SankeyChart';
import { SankeyChartContent } from './SankeyChartContent';

export interface SankeyChartWidgetProps extends Omit<ChartContentProps, 'children'>, SankeyChartProps {
  title: string;
  description?: string;
  href?: string;
  chartUrl?: string;
  containerProps?: FlexProps;
}

export const SankeyChartWidget = ({
  data,
  title,
  description,
  isLoading,
  href,
  chartUrl,
  containerProps,
  ...rest
}: SankeyChartWidgetProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <ChartWidgetRoot ref={ ref } { ...containerProps }>
      <Flex columnGap={ 6 } mb={ 2 } alignItems="flex-start">
        <ChartWidgetHeader
          title={ title }
          description={ description }
          isLoading={ isLoading }
          href={ href }
        />
        <Box ml="auto">
          <SankeyChartMenu
            data={ data }
            isLoading={ isLoading }
            title={ title }
            description={ description }
            chartRef={ ref }
            chartUrl={ chartUrl }
          />
        </Box>
      </Flex>
      <SankeyChartContent
        data={ data }
        isLoading={ isLoading }
        { ...rest }
      />
    </ChartWidgetRoot>
  );
};
