import { Text } from '@chakra-ui/react';
import React from 'react';

import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

export const TX_ACTIONS_BLOCK_ID = 'tx-actions';
const SCROLL_GRADIENT_HEIGHT = 48;

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  type: 'tx' | 'user_op';
}

const DetailsActionsWrapper = ({ children, isLoading, type }: Props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [ hasScroll, setHasScroll ] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setHasScroll(containerRef.current.scrollHeight >= containerRef.current.clientHeight + SCROLL_GRADIENT_HEIGHT / 2);
  }, []);

  return (
    <>
      <DetailsInfoItem.Label
        hint={ `Highlighted events of the ${ type === 'tx' ? 'transaction' : 'user operation' }` }
        isLoading={ isLoading }
      >
        <span>{ `${ type === 'tx' ? 'Transaction' : 'User operation' } action` }</span>
        { hasScroll && <Text fontWeight={ 500 } variant="secondary" fontSize="xs" className="note" align="right">Scroll to see more</Text> }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        position="relative"
      >
        <ContainerWithScrollY
          containerId={ TX_ACTIONS_BLOCK_ID }
          gradientHeight={ SCROLL_GRADIENT_HEIGHT }
          hasScroll={ hasScroll }
          alignItems="stretch"
          rowGap={ 5 }
          w="100%"
          maxH="200px"
          ref={ containerRef }
        >
          { children }
        </ContainerWithScrollY>
      </DetailsInfoItem.Value>

    </>
  );
};

export default React.memo(DetailsActionsWrapper);
