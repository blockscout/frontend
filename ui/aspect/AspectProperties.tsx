import { type UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AspectDetail as TAspectDetail } from '../../types/api/aspect';

import type { ResourceError } from '../../lib/api/resources';
import PropertiesContent from './PropertiesContent';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  aspectQuery: UseQueryResult<TAspectDetail, ResourceError>;
}

const AspectProperties = ({ aspectQuery }: Props) => {

  return (
    <PropertiesContent aspectQuery={ aspectQuery }/>
  );
};

export default AspectProperties;
