// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useSettingsModalContext } from 'src/shell/top-bar/settings/modal/context';

import { getCustomRpcUrl } from 'src/features/connect-wallet/utils/rpc-urls';

import { Alert } from 'src/toolkit/chakra/alert';
import { Link } from 'src/toolkit/chakra/link';

import { classifyRpcError, getRpcNotRespondingCopy } from './rpcError';

export interface Props {
  data: unknown;
  onSettle: () => void;
  estimatedGas?: bigint;
}

const RpcNotRespondingAlert = () => {
  const settingsModal = useSettingsModalContext();
  const copy = getRpcNotRespondingCopy(Boolean(getCustomRpcUrl()));

  const handleLinkClick = React.useCallback(() => {
    settingsModal?.open('rpc-node');
  }, [ settingsModal ]);

  return (
    <Alert status="error" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
      { copy.text }{ ' ' }
      <Link onClick={ handleLinkClick }>{ copy.linkText }</Link>
    </Alert>
  );
};

const ContractMethodResultPublicClient = ({ data, estimatedGas, onSettle }: Props) => {

  React.useEffect(() => {
    onSettle();
  }, [ onSettle ]);

  if (data instanceof Error) {
    if (classifyRpcError(data) === 'not-responding') {
      return <RpcNotRespondingAlert/>;
    }

    return (
      <Alert status="error" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
        { 'shortMessage' in data && typeof data.shortMessage === 'string' ? data.shortMessage : data.message }
      </Alert>
    );
  }

  if (estimatedGas) {
    return (
      <Alert status="info" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
        Success. Estimated gas: { estimatedGas.toLocaleString() }
      </Alert>
    );
  }

  return null;
};

export default React.memo(ContractMethodResultPublicClient);
