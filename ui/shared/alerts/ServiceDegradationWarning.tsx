import { Alert, Skeleton, Spinner, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const ServiceDegradationWarning = ({ isLoading, className }: Props) => {
  return (
    <Skeleton className={ className } isLoaded={ !isLoading }>
      <Alert status="warning" colorScheme="gray" alignItems={{ base: 'flex-start', lg: 'center' }}>
        <Spinner size="sm" mr={ 2 } my={{ base: '3px', lg: 0 }} flexShrink={ 0 }/>
        Data sync in progress... page will refresh automatically once data is available
      </Alert>
    </Skeleton>
  );
};

export default React.memo(chakra(ServiceDegradationWarning));
