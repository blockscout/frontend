// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MethodType } from './types';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';

import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

interface Props {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  type: MethodType;
  children: React.JSX.Element;
}

const ContractMethodsContainer = ({ isLoading, isError, isEmpty, type, children }: Props) => {

  if (isLoading) {
    return <ContentLoader w="fit-content"/>;
  }

  if (isError) {
    return <ApiFetchAlert/>;
  }

  if (isEmpty) {
    const typeText = type === 'all' ? '' : type;
    return <span>No public { typeText } functions were found for this contract.</span>;
  }

  return children;
};

export default React.memo(ContractMethodsContainer);
