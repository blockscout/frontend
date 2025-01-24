import type { StackProps, TabsContentProps } from '@chakra-ui/react';
import { Code, Grid, HStack } from '@chakra-ui/react';
import React from 'react';

import { Heading } from 'toolkit/chakra/heading';
import { TabsContent } from 'toolkit/chakra/tabs';

export const Container = (props: TabsContentProps) => <TabsContent display="flex" flexDirection="column" gap={ 6 } { ...props }/>;
export const Section = ({ children }: { children: React.ReactNode }) => <section>{ children }</section>;
export const SectionHeader = ({ children }: { children: React.ReactNode }) => <Heading level="2" mb={ 4 }>{ children }</Heading>;
export const SectionSubHeader = ({ children }: { children: React.ReactNode }) => <Heading level="3" mb={ 3 } _notFirst={{ mt: 4 }}>{ children }</Heading>;
export const SamplesStack = ({ children }: { children: React.ReactNode }) => (
  <Grid
    rowGap={ 4 }
    columnGap={ 8 }
    gridTemplateColumns="fit-content(100%) fit-content(100%)"
    justifyItems="flex-start"
    alignItems="flex-start"
  >
    { children }
  </Grid>
);
export const Sample = ({ children, label, ...props }: { children: React.ReactNode; label?: string } & StackProps) => (
  <>
    { label && <Code w="fit-content">{ label }</Code> }
    <HStack gap={ 3 } whiteSpace="pre-wrap" flexWrap="wrap" columnSpan={ label ? '1' : '2' } { ...props }>{ children }</HStack>
  </>
);
