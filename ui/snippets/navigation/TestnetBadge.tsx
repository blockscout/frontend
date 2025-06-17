/* eslint-disable */

import { chakra } from '@chakra-ui/react';
import React , { useMemo } from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {

  const text = useMemo(() => {

    const _t = (config.chain.rpcUrl || "")
      .replace('https://', '')
      .replace('http://', '')
      .split('.')[0]
      .replace("-rpc", "");

    if (!_t) {
        return 'testnet';
    } else {
        return _t;
    }
  }, [config.chain]);
 

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
          textTransform: 'capitalize',
          alignItems: 'center',
      }}
    >
        { text }
      </span>
    </span>
};

export default React.memo(chakra(TestnetBadge));
