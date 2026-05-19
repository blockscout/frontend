import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import appConfig from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import getErrorObj from 'lib/errors/getErrorObj';
import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

interface Props {
  item: PublicTagApplicationRow;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
}

interface EditFormFields {
  tag_name: string;
  description: string;
}

const PublicTagApplicationEditModal = ({ item, open, onOpenChange }: Props) => {
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  const [ error, setError ] = useState<string | null>(null);

  const formApi = useForm<EditFormFields>({
    defaultValues: {
      tag_name: item.tag_name,
      description: item.description ?? '',
    },
  });

  const handleClose = useCallback(() => {
    onOpenChange({ open: false });
  }, [ onOpenChange ]);

  const onSubmit = useCallback(async(data: EditFormFields) => {
    setError(null);
    try {
      await apiFetch('admin:public_tag_application_update', {
        pathParams: { chainId: appConfig.chain.id, id: String(item.id) },
        fetchParams: {
          method: 'PUT',
          body: data as unknown as Record<string, unknown>,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getResourceKey('admin:public_tag_applications_list', {
          pathParams: { chainId: appConfig.chain.id },
        }),
      });
      onOpenChange({ open: false });
    } catch (err: unknown) {
      const errorObj = getErrorObj(err);
      const msg = errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ?
        errorObj.message :
        'Failed to update tag request.';
      setError(msg);
    }
  }, [ apiFetch, item.id, onOpenChange, queryClient ]);

  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <DialogHeader>Edit tag request</DialogHeader>
        <DialogCloseTrigger/>
        <FormProvider { ...formApi }>
          <form onSubmit={ formApi.handleSubmit(onSubmit) }>
            <DialogBody>
              { error && <p style={{ color: 'red', marginBottom: 8 }}>{ error }</p> }
              <FormFieldText<EditFormFields>
                name="tag_name"
                placeholder="Tag name"
                required
              />
              <FormFieldText<EditFormFields>
                name="description"
                placeholder="Description"
                asComponent="Textarea"
                size="2xl"
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={ handleClose }>Cancel</Button>
              <Button
                type="submit"
                loading={ formApi.formState.isSubmitting }
                loadingText="Saving"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(PublicTagApplicationEditModal);
