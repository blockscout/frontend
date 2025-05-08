import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {
  relativeText?: string;
  absoluteText?: string;
}

const TimeFormatToggle = ({ relativeText, absoluteText, ...props }: Props) => {
  const settings = useSettingsContext();
  const timeFormat = settings?.timeFormat || 'relative';

  const text = timeFormat === 'relative' ? relativeText || 'Age' : absoluteText || 'Time and date (UTC)';

  return (
    <Link onClick={ settings?.toggleTimeFormat } variant="secondary" textDecoration="underline dashed" { ...props }>
      { text }
    </Link>
  );
};

export default React.memo(TimeFormatToggle);
