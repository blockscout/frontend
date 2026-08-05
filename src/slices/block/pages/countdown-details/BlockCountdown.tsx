// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Center, Flex, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import CapybaraRunner from 'src/features/easter-eggs/components/runner/CapybaraRunner';
import { useMultichainContext } from 'src/features/multichain/context';

import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { route } from 'src/shared/router/routes';
import StatsWidget from 'src/shared/stats/StatsWidget';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { Heading } from 'src/toolkit/chakra/heading';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';
import { downloadBlob } from 'src/toolkit/utils/file';

import BlockCountdownTimer from './BlockCountdownTimer';
import createGoogleCalendarLink from './create-google-calendar-link';
import createIcsFileBlob from './create-ics-file-blob';

type Props = {
  hideCapybaraRunner?: boolean;
};

const BlockCountdown = ({ hideCapybaraRunner }: Props) => {
  const multichainContext = useMultichainContext();
  const router = useRouter();
  const height = getQueryParamString(router.query.height);

  const { data, isPending, isError, error } = useApiQuery('core:block_countdown', {
    pathParams: { height },
  });

  // the API answers 404 when the block is already mined, which is the same outcome as the countdown running out
  const isBlockMined = isError && error.status === 404;

  const handleAddToAppleCalClick = React.useCallback(() => {
    if (!data?.estimated_time_in_seconds) {
      return;
    }
    const fileBlob = createIcsFileBlob({ blockHeight: height, date: dayjs().add(Number(data.estimated_time_in_seconds), 's'), multichainContext });
    downloadBlob(fileBlob, `Block #${ height } creation event.ics`);
  }, [ data?.estimated_time_in_seconds, height, multichainContext ]);

  const handleTimerFinish = React.useCallback(() => {
    window.location.assign(route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: height } }, multichainContext));
  }, [ height, multichainContext ]);

  React.useEffect(() => {
    if (isBlockMined) {
      handleTimerFinish();
    }
  }, [ handleTimerFinish, isBlockMined ]);

  if (isError && !isBlockMined) {
    throwOnResourceLoadError({ isError, error, resource: 'core:block_countdown' });
  }

  if (isPending || isBlockMined || !data) {
    return <Center h="100%"><ContentLoader/></Center>;
  }

  return (
    <Center h="100%" alignItems={{ base: 'flex-start', lg: 'center' }}>
      <Flex flexDir="column" w="fit-content" maxW={{ base: '100%', lg: '700px', xl: '1000px' }}>
        <Flex columnGap={ 8 } alignItems="flex-start" justifyContent={{ base: 'space-between', lg: undefined }} w="100%">
          <Box maxW={{ base: 'calc(100% - 65px - 32px)', lg: 'calc(100% - 125px - 32px)' }}>
            <Heading
              level="1"
            >
              <TruncatedText text={ `Block #${ height }` } w="100%"/>
            </Heading>
            <Box mt={ 2 } color="text.secondary">
              <Box fontWeight={ 600 }>Estimated target date</Box>
              <Time timestamp={ dayjs().add(Number(data.estimated_time_in_seconds), 's').valueOf() }/>
            </Box>
            <Flex columnGap={ 2 } mt={ 3 }>
              <Link
                external
                variant="underlaid"
                textStyle="sm"
                px={ 2 }
                display="inline-flex"
                href={ createGoogleCalendarLink({ blockHeight: height, timeFromNow: Number(data.estimated_time_in_seconds), multichainContext }) }
              >
                <Image src="/static/google_calendar.svg" alt="Google calendar logo" boxSize={ 5 } mr={ 2 }/>
                <span>Google</span>
              </Link>
              <Button
                variant="plain"
                px={ 2 }
                size="sm"
                fontWeight="normal"
                color="link.primary"
                _hover={{ color: 'link.primary.hover' }}
                bgColor="link.underlaid.bg"
                display="inline-flex"
                onClick={ handleAddToAppleCalClick }
              >
                <Image src="/static/apple_calendar.svg" alt="Apple calendar logo" boxSize={ 5 }/>
                <span>Apple</span>
              </Button>
            </Flex>
          </Box>
          <Box position="relative">
            <SpriteIcon
              name="block"
              w={{ base: '65px', lg: '125px' }}
              h={{ base: '75px', lg: '140px' }}
              color={{ _light: 'gray.300', _dark: 'gray.600' }}
              flexShrink={ 0 }
            />
            { multichainContext?.chain && (
              <ChainIcon
                data={ multichainContext.chain }
                position="absolute"
                bottom={{ base: '5px', lg: '6px' }}
                right={{ base: '45px', lg: '86px' }}
                boxSize={{ lg: '60px' }}
                bgColor="bg.primary"
                borderRadius="full"
              />
            ) }
          </Box>
        </Flex>
        <BlockCountdownTimer
          value={ Math.ceil(Number(data.estimated_time_in_seconds)) }
          onFinish={ handleTimerFinish }
        />
        <Grid gridTemplateColumns="repeat(2, calc(50% - 4px))" columnGap={ 2 } mt={ 2 }>
          <StatsWidget label="Remaining blocks" value={ data.remaining_blocks_count } icon="apps"/>
          <StatsWidget label="Current block" value={ data.current_block_number } icon="block"/>
        </Grid>
        { !hideCapybaraRunner && <CapybaraRunner/> }
      </Flex>
    </Center>
  );
};

export default React.memo(BlockCountdown);
