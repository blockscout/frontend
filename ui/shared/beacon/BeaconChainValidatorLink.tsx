import { Grid } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Link, LinkExternalIcon } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

const feature = config.features.beaconChain;

const BeaconChainValidatorLink = ({ pubkey, isLoading }: { pubkey: string; isLoading?: boolean }) => {
  if (!feature.isEnabled) {
    return null;
  }

  let content;

  if (!feature.validatorUrlTemplate) {
    content = (
      <Skeleton
        loading={ isLoading }
        display="inline-block"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        maxW="100%"
      >
        { pubkey }
      </Skeleton>
    );
  } else {
    content = (
      <>
        <Link
          href={ feature.validatorUrlTemplate.replace('{pk}', pubkey) }
          external
          loading={ isLoading }
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW="100%"
          display="inline-block"
          noIcon
        >
          { pubkey }
        </Link>
        <LinkExternalIcon/>
      </>
    );
  }
  return (
    <Grid overflow="hidden" templateColumns={ feature.validatorUrlTemplate ? 'auto 20px 24px' : 'auto 24px' } alignItems="center">
      { content }
      <CopyToClipboard
        text={ pubkey }
        type="text"
        isLoading={ isLoading }
        ml={ 1 }
      />
    </Grid>
  );
};

export default React.memo(BeaconChainValidatorLink);
