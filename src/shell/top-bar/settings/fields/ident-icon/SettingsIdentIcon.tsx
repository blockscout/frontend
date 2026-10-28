// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../../types';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import * as cookies from 'src/shared/storage/cookies';

import SettingsSample from '../../parts/SettingsSample';
import SettingsSampleValue from '../../parts/SettingsSampleValue';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';
import { IDENTICONS } from './utils';

interface Props {
  variant?: SettingsControlVariant;
}

const SettingsIdentIcon = ({ variant = 'popover' }: Props) => {
  const [ activeId, setActiveId ] = React.useState<string>();
  const isMobile = useIsMobile();

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
  const showSectionTitle = !isMobile || variant === 'popover';

  return (
    <div>
      { showSectionTitle && <SettingsSectionTitle variant={ variant } title="Address identicon"/> }
      <SettingsSampleValue variant={ variant } value={ activeIdenticon?.label } prefix={ showSectionTitle ? undefined : 'Address identicon: ' }/>
      <Flex gap={ variant === 'modal' ? 2 : 0 }>
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
      </Flex>
    </div>
  );
};

export default React.memo(SettingsIdentIcon);
