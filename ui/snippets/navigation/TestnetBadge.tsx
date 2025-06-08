/* eslint-disable */

import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return <span style={{
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '1.375rem',
      width: '3.56rem',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: ' #FFF',
  }}>
      <span style={{
          color: 'var(--decorative, #FF89D0)',
          fontFamily: 'HarmonyOS Sans',
          fontSize: '0.75rem',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
      }}
    >
        Testnet
      </span>
    </span>
};

export default React.memo(chakra(TestnetBadge));
