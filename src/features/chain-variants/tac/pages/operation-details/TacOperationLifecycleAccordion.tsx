// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { Root, Item, Trigger } from 'src/shared/lifecycle/accordion/LifecycleAccordion';

import { STATUS_LABELS } from '../../utils/tac-operation';
import TacOperationLifecycleAccordionItemContent from './TacOperationLifecycleAccordionItemContent';

interface Props {
  data: tac.V2OperationDetails['status_history'];
  isLoading?: boolean;
  status: tac.V2OperationStatus;
}

const TacOperationLifecycleAccordion = ({ data, isLoading, status }: Props) => {
  const isPending = status === tac.V2OperationStatus.pending && !isLoading;

  return (
    <Root>
      { data.map((item, index) => {
        const isLast = index === data.length - 1 && !isPending;
        return (
          <Item key={ index } value={ item.type }>
            <Trigger
              status={ item.is_success ? 'success' : 'error' }
              text={ STATUS_LABELS[item.type] }
              isFirst={ index === 0 }
              isLast={ isLast }
              isLoading={ isLoading }
            />
            <TacOperationLifecycleAccordionItemContent
              isLast={ isLast }
              data={ item }
            />
          </Item>
        );
      }) }
      { isPending && (
        <Item value="pending">
          <Trigger
            status="pending"
            text="Pending"
            isFirst={ false }
            isLast={ true }
            isLoading={ isLoading }
            isDisabled
          />
        </Item>
      ) }
    </Root>
  );
};

export default React.memo(TacOperationLifecycleAccordion);
