// SPDX-License-Identifier: LicenseRef-Blockscout

import { Tabs as ChakraTabs, chakra } from '@chakra-ui/react';
import * as React from 'react';

export interface TabsProps extends ChakraTabs.RootProps {}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  function TabsRoot(props, ref) {
    const { lazyMount = true, unmountOnExit = true, ...rest } = props;
    return <ChakraTabs.Root ref={ ref } { ...rest } lazyMount={ lazyMount } unmountOnExit={ unmountOnExit }/>;
  },
);

export const TabsList = ChakraTabs.List;

export interface TabsTriggerProps extends ChakraTabs.TriggerProps {}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(props, ref) {
    return <ChakraTabs.Trigger ref={ ref } className="group" { ...props }/>;
  },
);

export interface TabsContentProps extends ChakraTabs.ContentProps {}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ children, ...rest }, ref) {
    // A panel that suspends on mount must not suspend an outer boundary: hiding the tabs disconnects
    // their state machines, and the previous panel then never hides.
    return (
      <ChakraTabs.Content ref={ ref } { ...rest }>
        <React.Suspense fallback={ null }>
          { children }
        </React.Suspense>
      </ChakraTabs.Content>
    );
  },
);

export interface TabsCounterProps {
  count?: number | null;
}

export const TabsCounter = ({ count }: TabsCounterProps) => {
  const COUNTER_OVERLOAD = 50;

  if (count === undefined || count === null) {
    return null;
  }

  return (
    <chakra.span
      color={ count > 0 ? 'text.secondary' : { _light: 'blackAlpha.400', _dark: 'whiteAlpha.400' } }
      _groupHover={{
        color: 'inherit',
      }}
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </chakra.span>
  );
};
