/* eslint-disable react/jsx-no-bind */
import { IconButton, Popover, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, Box, Image } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import SettingsColorTheme from './SettingsColorTheme';

const Settings = () => {
  const { t } = useTranslation('common');

  const router = useRouter();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const changeLocaleTo = (newLocale: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(router.asPath as any, router.asPath as any, { locale: newLocale as any });
  };

  return (
    <Popover placement="bottom-start" trigger="click" isOpen={ isOpen } onClose={ onClose }>
      <PopoverTrigger>
        <IconButton
          variant="simple"
          aria-label="User settings"
          icon={ <IconSvg name="gear" boxSize={ 5 }/> }
          p="1px"
          boxSize={ 5 }
          onClick={ onToggle }
        />
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="auto" fontSize="sm">
        <PopoverBody boxShadow="2xl" p={ 4 }>
          <SettingsColorTheme/>
          <Box borderColor="divider" borderWidth="1px" my={ 3 }/>

          <Box fontWeight={ 600 } mb={ 2 }>{ t('Language') }</Box>
          <Box display="flex" flexDirection="row">
            <Image
              src="/static/flags/en.svg"
              width="16px"
              height="16px"
              alt={ t('locales.English') }
              cursor="pointer"
              onClick={ () => changeLocaleTo('en') }
            />

            <Image
              src="/static/flags/cn.svg"
              width="16px"
              height="16px"
              alt={ t('locales.Mandarin') }
              cursor="pointer"
              onClick={ () => changeLocaleTo('cn') }
              marginLeft="4px"
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(Settings);
