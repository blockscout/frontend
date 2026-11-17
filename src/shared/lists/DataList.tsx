// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';

import type { EmptyStateProps } from 'src/toolkit/chakra/empty-state';
import { EmptyState } from 'src/toolkit/chakra/empty-state';

export type Props = {
  isError: boolean;
  itemsNum?: number;
  emptyText?: React.ReactNode;
  actionBar?: React.ReactNode;
  showActionBarIfEmpty?: boolean;
  showActionBarIfError?: boolean;
  children: React.ReactNode;
  className?: string;
  hasActiveFilters?: boolean;
  emptyStateProps?: EmptyStateProps;
  isTransitioning?: boolean;
};

const DataList = (props: Props) => {
  if (props.isError) {
    if (props.showActionBarIfError) {
      return (
        <Box className={ props.className }>
          { props.actionBar }
          <ApiFetchAlert/>
        </Box>
      );
    }

    return <ApiFetchAlert className={ props.className }/>;
  }

  if (props.hasActiveFilters && !props.itemsNum) {
    return (
      <Box className={ props.className }>
        { props.actionBar }
        <EmptyState { ...props.emptyStateProps }/>
      </Box>
    );
  }

  if (!props.itemsNum) {
    return (
      <>
        { props.showActionBarIfEmpty && props.actionBar }
        { Boolean(props.emptyText) && <Text className={ props.className }>{ props.emptyText }</Text> }
      </>
    );
  }

  return (
    <Box className={ props.className }>
      { props.actionBar }
      { /* TODO: page-transition look, currently never active — https://github.com/blockscout/frontend/issues/3704 */ }
      <Box
        opacity={ props.isTransitioning ? 'control.disabled' : undefined }
        pointerEvents={ props.isTransitioning ? 'none' : undefined }
        aria-busy={ props.isTransitioning || undefined }
      >
        { props.children }
      </Box>
    </Box>
  );
};

export default chakra(DataList);
