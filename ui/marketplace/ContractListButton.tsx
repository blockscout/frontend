import { Link, Tooltip, Skeleton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

export enum ContractListButtonVariants {
  ALL_CONTRACTS = 'all contracts',
  VERIFIED_CONTRACTS = 'verified contracts',
}

const values = {
  [ContractListButtonVariants.ALL_CONTRACTS]: {
    icon: 'contracts' as const,
    iconColor: 'gray.500',
    tooltip: `Total number of contracts deployed by the protocol on ${ config.chain.name }`,
  },
  [ContractListButtonVariants.VERIFIED_CONTRACTS]: {
    icon: 'contracts_verified' as const,
    iconColor: 'green.500',
    tooltip: `Number of verified contracts on ${ config.chain.name }`,
  },
};

interface Props {
  children: string | number;
  onClick: (event: MouseEvent) => void;
  variant: ContractListButtonVariants;
  isLoading?: boolean;
}

const ContractListButton = ({ children, onClick, variant, isLoading }: Props) => {
  const { icon, iconColor, tooltip } = values[variant];
  return (
    <Tooltip
      label={ tooltip }
      textAlign="center"
      padding={ 2 }
      isDisabled={ !tooltip }
      openDelay={ 500 }
      width="250px"
    >
      <Skeleton
        isLoaded={ !isLoading }
        display="inline-flex"
        alignItems="center"
        width={ isLoading ? '40px' : 'auto' }
        height="30px"
        borderRadius="base"
      >
        <Link
          fontSize="sm"
          onClick={ onClick }
          fontWeight="500"
          display="inline-flex"
        >
          { icon && <IconSvg name={ icon } boxSize={ 5 } color={ iconColor } mr={ 1 }/> }
          { children }
        </Link>
      </Skeleton>
    </Tooltip>
  );
};

export default ContractListButton;
