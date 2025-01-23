import { Tabs as ChakraTabs } from '@chakra-ui/react';
import * as React from 'react';

export interface TabsProps extends ChakraTabs.RootProps {}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  function TabsRoot(props, ref) {
    return <ChakraTabs.Root ref={ ref } { ...props }/>;
  },
);

export const TabsList = ChakraTabs.List;
export const TabsTrigger = ChakraTabs.Trigger;
export const TabsContent = ChakraTabs.Content;
