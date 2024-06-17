import { Grid, GridItem } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import type { Path, ControllerRenderProps, FieldValues, Control } from 'react-hook-form';

import config from 'configs/app';
import CheckboxInput from 'ui/shared/CheckboxInput';

const tokenStandardName = config.chain.tokenStandard;

const NOTIFICATIONS = [ 'native', 'ERC-20', 'ERC-721', 'ERC-404' ] as const;
const NOTIFICATIONS_NAMES = [
  config.chain.currency.symbol,
  `${ tokenStandardName }-20`,
  `${ tokenStandardName }-721, ${ tokenStandardName }-1155 (NFT)`,
  `${ tokenStandardName }-404` ];

type Props<Inputs extends FieldValues> = {
  control: Control<Inputs>;
}

export default function AddressFormNotifications<Inputs extends FieldValues, Checkboxes extends Path<Inputs>>({ control }: Props<Inputs>) {
  // eslint-disable-next-line react/display-name
  const renderCheckbox = useCallback((text: string) => ({ field }: {field: ControllerRenderProps<Inputs, Checkboxes>}) => (
    <CheckboxInput<Inputs, Checkboxes> text={ text } field={ field }/>
  ), []);

  return (
    <Grid templateColumns={{ base: 'repeat(2, max-content)', lg: 'repeat(3, max-content)' }} gap={{ base: '10px 24px', lg: '20px 24px' }}>
      { NOTIFICATIONS.map((notification: string, index: number) => {
        const incomingFieldName = `notification_settings.${ notification }.incoming` as Checkboxes;
        const outgoingFieldName = `notification_settings.${ notification }.outcoming` as Checkboxes;
        return (
          <React.Fragment key={ notification }>
            <GridItem
              gridColumnStart={{ base: 1, lg: 1 }}
              gridColumnEnd={{ base: 3, lg: 1 }}
              _notFirst={{
                mt: { base: 3, lg: 0 },
              }}
            >
              { NOTIFICATIONS_NAMES[index] }
            </GridItem>
            <GridItem>
              <Controller
                name={ incomingFieldName }
                control={ control }

                render={ renderCheckbox('Incoming') }
              />
            </GridItem>
            <GridItem>
              <Controller
                name={ outgoingFieldName }
                control={ control }

                render={ renderCheckbox('Outgoing') }
              />
            </GridItem>
          </React.Fragment>
        );
      }) }
    </Grid>
  );
}
