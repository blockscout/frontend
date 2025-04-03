import { Box, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

interface Props<TData> {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  data?: TData;
  title: string;
  text?: string;
  renderForm: () => React.JSX.Element;
  isAlertVisible?: boolean;
  setAlertVisible?: (isAlertVisible: boolean) => void;
}

export default function FormModal<TData>({
  open,
  onOpenChange,
  title,
  text,
  renderForm,
  isAlertVisible,
  setAlertVisible,
}: Props<TData>) {

  const handleOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setAlertVisible?.(false);
    onOpenChange({ open });
  }, [ onOpenChange, setAlertVisible ]);

  return (
    <DialogRoot open={ open } onOpenChange={ handleOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <DialogHeader>{ title }</DialogHeader>
        <DialogBody>
          { (isAlertVisible || text) && (
            <Box marginBottom={{ base: 6, lg: 8 }}>
              { text && (
                <Text lineHeight="30px" mb={ 3 }>
                  { text }
                </Text>
              ) }
              { isAlertVisible && <FormSubmitAlert/> }
            </Box>
          ) }
          { renderForm() }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
