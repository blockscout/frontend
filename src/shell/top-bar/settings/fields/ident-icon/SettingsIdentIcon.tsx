// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SettingsControlVariant } from '../../types';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import SettingsSample from '../../parts/SettingsSample';
import SettingsSamplesRow from '../../parts/SettingsSamplesRow';
import { IDENTICONS } from './utils';

interface Props {
  variant?: SettingsControlVariant;
}

const SettingsIdentIcon = ({ variant = 'popover' }: Props) => {
  const [ activeId, setActiveId ] = React.useState<string>();

  React.useEffect(() => {
    const initialId = cookies.get(cookies.NAMES.ADDRESS_IDENTICON_TYPE) || config.slices.address.identiconType;
    setActiveId(initialId);
  }, []);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const id = event.currentTarget.getAttribute('data-value');

    if (!id) {
      return;
    }

    cookies.set(cookies.NAMES.ADDRESS_IDENTICON_TYPE, id);
    window.location.reload();
  }, []);

  const activeIdenticon = IDENTICONS.find((identicon) => identicon.id === activeId);
  return (
    <SettingsSamplesRow variant={ variant } title="Address identicon" mobileTitle="Identicon" value={ activeIdenticon?.label }>
      { IDENTICONS.map((identicon) => (
        <SettingsSample
          key={ identicon.id }
          label={ identicon.label }
          value={ identicon.id }
          bg={ identicon.sampleBg }
          isActive={ identicon.id === activeId }
          onClick={ handleSelect }
        />
      )) }
    </SettingsSamplesRow>
  );
};

export default React.memo(SettingsIdentIcon);
