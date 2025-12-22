import { EmptyState as ChakraEmptyState, VStack } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import * as React from 'react';

import { apos } from '../utils/htmlEntities';
import QueryIcon from './assets/empty_state_query.svg';
import StatsIcon from './assets/empty_state_stats.svg';

export type EmptyStateType = 'query' | 'stats';

const ICONS: Partial<Record<EmptyStateType, React.FC>> = {
  query: QueryIcon,
  stats: StatsIcon,
};

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title?: string;
  description?: React.ReactNode;
  term?: string;
  type?: EmptyStateType;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, description, term, type = 'query', icon, children, ...rest } = props;

    const titleContent = (() => {
      if (title) {
        return title;
      }

      if (type === 'stats') {
        return 'Collecting data';
      }

      return 'No results';
    })();

    const descriptionContent = (() => {
      if (description) {
        return description;
      }

      if (term && type === 'query') {
        return `Couldn${ apos }t find any ${ term } that matches your query.`;
      }

      if (type === 'stats') {
        return term ? `${ upperFirst(term) } stats will be added soon` : 'Charts and statistics will be available soon';
      }
    })();

    const iconContent = (() => {
      const Icon = ICONS[type];
      if (Icon) {
        return <Icon/>;
      }
      return null;
    })();

    return (
      <ChakraEmptyState.Root ref={ ref } { ...rest }>
        <ChakraEmptyState.Content>
          { iconContent && (
            <ChakraEmptyState.Indicator>{ iconContent }</ChakraEmptyState.Indicator>
          ) }
          { descriptionContent ? (
            <VStack textAlign="center" gap={ 2 }>
              <ChakraEmptyState.Title>{ titleContent }</ChakraEmptyState.Title>
              <ChakraEmptyState.Description>
                { descriptionContent }
              </ChakraEmptyState.Description>
            </VStack>
          ) : (
            <ChakraEmptyState.Title>{ titleContent }</ChakraEmptyState.Title>
          ) }
          { children }
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  },
);
