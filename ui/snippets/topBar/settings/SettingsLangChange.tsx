import { Box, Select } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSelect?: () => void;
}

const SettingsLangChange: React.FC<Props> = ({ onSelect }) => {
  const { i18n } = useTranslation();

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
    onSelect?.();
  }, [ i18n, onSelect ]);

  return (
    <Box>
      <Box fontWeight={ 600 }>Language</Box>
      <Select mt={ 1 } mb={ 2 } onChange={ handleChange } defaultValue={ i18n.language }>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </Select>
    </Box>
  );
};

export default React.memo(SettingsLangChange);
