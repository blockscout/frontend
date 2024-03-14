import { Link, Tooltip } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import config from 'configs/app';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export enum LinkButtonVariants {
  DEFAULT = 'default',
  ALL_CONTRACTS = 'all contracts',
  VERIFIED_CONTRACTS = 'verified contracts',
}

const values = {
  [LinkButtonVariants.ALL_CONTRACTS]: {
    icon: 'contracts' as IconName,
    iconColor: 'gray.500',
    tooltip: `Total number of contracts deployed by the protocol on ${ config.chain.name }`,
  },
  [LinkButtonVariants.VERIFIED_CONTRACTS]: {
    icon: 'contracts_verified' as IconName,
    iconColor: 'green.500',
    tooltip: `Number of verified contracts on ${ config.chain.name }`,
  },
  [LinkButtonVariants.DEFAULT]: {
    icon: null,
    iconColor: null,
    tooltip: null,
  },
};

interface Props {
  children: string;
  onClick: (event: MouseEvent) => void;
  variant?: LinkButtonVariants;
}

const LinkButton = ({ children, onClick, variant = LinkButtonVariants.DEFAULT }: Props) => {
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

export default LinkButton;
