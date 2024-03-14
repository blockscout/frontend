import { Link, Tooltip } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import config from 'configs/app';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export enum ContractListButtonVariants {
  ALL_CONTRACTS = 'all contracts',
  VERIFIED_CONTRACTS = 'verified contracts',
}

const values = {
  [ContractListButtonVariants.ALL_CONTRACTS]: {
    icon: 'contracts' as IconName,
    iconColor: 'gray.500',
    tooltip: `Total number of contracts deployed by the protocol on ${ config.chain.name }`,
  },
  [ContractListButtonVariants.VERIFIED_CONTRACTS]: {
    icon: 'contracts_verified' as IconName,
    iconColor: 'green.500',
    tooltip: `Number of verified contracts on ${ config.chain.name }`,
  },
};

interface Props {
  children: string;
  onClick: (event: MouseEvent) => void;
  variant: ContractListButtonVariants;
}

const ContractListButton = ({ children, onClick, variant }: Props) => {
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
      <Link
        fontSize="sm"
        onClick={ onClick }
        fontWeight="500"
        display="inline-flex"
      >
        { icon && <IconSvg name={ icon } boxSize={ 5 } color={ iconColor } mr={ 1 }/> }
        { children }
      </Link>
    </Tooltip>
  );
};

export default ContractListButton;
