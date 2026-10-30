// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { buildUrl } from 'src/features/token-action-button/utils/build-url';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import * as analytics from 'src/shared/analytics';

import { Button } from 'src/toolkit/chakra/button';
import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';
import { Link, LinkExternalIcon } from 'src/toolkit/chakra/link';

const button = getFeaturePayload(config.features.tokenActionButton)?.button;

interface Props {
  tokenHash: string;
  tokenType: string | undefined | null;
  isLoading?: boolean;
}

const TokenActionButton = ({ tokenHash, tokenType, isLoading }: Props) => {
  const href = button ? buildUrl(button.url, tokenHash) : undefined;

  const handleClick = React.useCallback(() => {
    if (href) {
      analytics.logEvent(analytics.EventTypes.PAGE_WIDGET, { Type: 'Action button', Info: href, Source: 'Token' });
    }
  }, [ href ]);

  const logoSrc = useColorModeValue(
    button?.logo?.[0],
    button?.logo?.[1] || button?.logo?.[0],
  );

  if (!button || !href) {
    return null;
  }

  if (!isLoading && tokenType !== 'ERC-20') {
    return null;
  }

  const colors = button.colors?._default;
  const background = {
    _light: colors?.bg?.[0],
    _dark: colors?.bg?.[1] || colors?.bg?.[0],
  };
  const textColor = {
    _light: colors?.text?.[0],
    _dark: colors?.text?.[1] || colors?.text?.[0],
  };

  return (
    <Link
      href={ href }
      external
      noIcon
      ml={{ base: 0, lg: 'auto' }}
      loading={ isLoading }
    >
      <Button
        size="sm"
        gap={ 0 }
        bg={ background }
        color={ textColor }
        _hover={{
          color: textColor,
          // the background is operator-configured, so hover dims the button instead of switching to a token color — same as metadata tags
          opacity: 0.76,
        }}
        onClick={ handleClick }
      >
        { logoSrc && <Image src={ logoSrc } alt={ button.text } boxSize={ 5 } flexShrink={ 0 } mr={ 2 }/> }
        { button.text }
        <LinkExternalIcon color={ textColor }/>
      </Button>
    </Link>
  );
};

export default React.memo(TokenActionButton);
