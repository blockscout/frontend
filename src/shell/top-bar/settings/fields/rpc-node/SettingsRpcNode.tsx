// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { CUSTOM_RPC_IN_USE_VALUE } from 'src/features/connect-wallet/utils/rpc-urls';

import * as analytics from 'src/shared/analytics';
import * as cookies from 'src/shared/storage/cookies';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Alert } from 'src/toolkit/chakra/alert';
import { Badge } from 'src/toolkit/chakra/badge';
import { Button } from 'src/toolkit/chakra/button';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { FormFieldUrl } from 'src/toolkit/components/forms/fields/FormFieldUrl';

import { useRpcNodePingQuery } from './useRpcNodePingQuery';
import type { SavedRpcNode } from './utils';
import { getRpcNodeStatus, getSavedRpcNode, validateRpcUrl } from './utils';

interface FormFields {
  url: string;
}

const URL_RULES = { validate: { https: validateRpcUrl } };
const INPUT_PROPS = { 'aria-label': 'RPC node URL', spellCheck: false, bgColor: 'dialog.bg' };

const SettingsRpcNode = () => {
  const [ savedNode ] = React.useState<SavedRpcNode>(getSavedRpcNode);

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: { url: savedNode.url ?? '' },
  });
  const { isDirty, errors } = formApi.formState;

  const pingQuery = useRpcNodePingQuery(savedNode.isInUse ? savedNode.url : undefined);

  const handleSubmit: SubmitHandler<FormFields> = React.useCallback(({ url }) => {
    const nextUrl = url.trim();

    if (nextUrl) {
      cookies.set(cookies.NAMES.CUSTOM_RPC_URL, nextUrl);
      cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, CUSTOM_RPC_IN_USE_VALUE);
      analytics.logEvent(analytics.EventTypes.RPC_NODE, { Action: 'Set' }, { sendImmediately: true });
    } else {
      cookies.remove(cookies.NAMES.CUSTOM_RPC_URL);
      cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
      analytics.logEvent(analytics.EventTypes.RPC_NODE, { Action: 'Reset' }, { sendImmediately: true });
    }

    window.location.reload();
  }, []);

  const handleTogglePlug = React.useCallback(() => {
    if (savedNode.isInUse) {
      cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
      analytics.logEvent(analytics.EventTypes.RPC_NODE, { Action: 'Disconnect' }, { sendImmediately: true });
    } else {
      cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, CUSTOM_RPC_IN_USE_VALUE);
      analytics.logEvent(analytics.EventTypes.RPC_NODE, { Action: 'Connect' }, { sendImmediately: true });
    }

    window.location.reload();
  }, [ savedNode.isInUse ]);

  const status = savedNode.url ? getRpcNodeStatus(savedNode.isInUse ? (pingQuery.data?.outcome ?? 'connected') : 'disconnected') : undefined;
  const isStatusPending = savedNode.isInUse && pingQuery.data === undefined;

  return (
    <FormProvider { ...formApi }>
      <chakra.form noValidate onSubmit={ formApi.handleSubmit(handleSubmit) }>
        <VStack gap={ 3 } alignItems="stretch">
          <HStack gap={ 3 } alignItems="flex-start">
            <FormFieldUrl<FormFields>
              name="url"
              placeholder="RPC node URL"
              rules={ URL_RULES }
              size="sm"
              floating={ false }
              flexGrow={ 1 }
              inputProps={ INPUT_PROPS }
            />
            <Button type="submit" variant="outline" size="sm" disabled={ !isDirty || Boolean(errors.url) } loading={ formApi.formState.isSubmitting }>
              Save
            </Button>
            { status && (
              <Tooltip content={ savedNode.isInUse ? 'Disconnect custom RPC node' : 'Connect custom RPC node' }>
                <IconButton
                  variant="icon_background"
                  size="md"
                  aria-label={ savedNode.isInUse ? 'Disconnect custom RPC node' : 'Connect custom RPC node' }
                  disabled={ isDirty }
                  loadingSkeleton={ isStatusPending }
                  onClick={ handleTogglePlug }
                  color={ status.plug.color }
                >
                  <SpriteIcon name={ status.plug.icon }/>
                </IconButton>
              </Tooltip>
            ) }
          </HStack>
          { status && (
            <>
              <HStack gap={ 1 }>
                <Badge colorPalette={ status.tag.colorPalette } loading={ isStatusPending }>{ status.tag.label }</Badge>
                <Skeleton loading={ isStatusPending } textStyle="sm" color="text.secondary">{ status.nodeText }</Skeleton>
              </HStack>
              { !isStatusPending && status.alert && (
                <Alert status={ status.alert.status } textStyle="sm">{ status.alert.text }</Alert>
              ) }
            </>
          ) }
        </VStack>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(SettingsRpcNode);
