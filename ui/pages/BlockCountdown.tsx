import { Box, Center, Flex, Heading, Image, useColorModeValue, Grid, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import downloadBlob from 'lib/downloadBlob';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import BlockCountdownTimer from 'ui/blockCountdown/BlockCountdownTimer';
import createGoogleCalendarLink from 'ui/blockCountdown/createGoogleCalendarLink';
import createIcsFileBlob from 'ui/blockCountdown/createIcsFileBlob';
import ContentLoader from 'ui/shared/ContentLoader';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import TruncatedValue from 'ui/shared/TruncatedValue';

const BlockCountdown = () => {
  const router = useRouter();
  const height = getQueryParamString(router.query.height);
  const iconColor = useColorModeValue('gray.300', 'gray.600');
  const buttonBgColor = useColorModeValue('gray.100', 'gray.700');

  const { data, isPending, isError, error } = useApiQuery('block_countdown', {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });

  const handleAddToAppleCalClick = React.useCallback(() => {
    if (!data?.result?.EstimateTimeInSec) {
      return;
    }
    const fileBlob = createIcsFileBlob({ blockHeight: height, date: dayjs().add(Number(data.result.EstimateTimeInSec), 's') });
    downloadBlob(fileBlob, `Block #${ height } creation event.ics`);
  }, [ data?.result?.EstimateTimeInSec, height ]);

  const handleTimerFinish = React.useCallback(() => {
    window.location.assign(route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: height } }));
  }, [ height ]);

  React.useEffect(() => {
    if (!isError && !isPending && !data.result) {
      handleTimerFinish();
    }
  }, [ data?.result, handleTimerFinish, isError, isPending ]);

  if (isError) {
    throwOnResourceLoadError({ isError, error, resource: 'block_countdown' });
  }

  if (isPending || !data?.result) {
    return <Center h="100%"><ContentLoader/></Center>;
  }

  return (
    <Center h="100%" alignItems={{ base: 'flex-start', lg: 'center' }}>
      <Flex flexDir="column" w="fit-content" maxW={{ base: '100%', lg: '700px', xl: '1000px' }}>
        <Flex columnGap={ 8 } alignItems="flex-start" justifyContent={{ base: 'space-between', lg: undefined }} w="100%">
          <Box maxW={{ base: 'calc(100% - 65px - 32px)', lg: 'calc(100% - 125px - 32px)' }}>
            <Heading
              fontSize={{ base: '18px', lg: '32px' }}
              lineHeight={{ base: '24px', lg: '40px' }}
              h={{ base: '24px', lg: '40px' }}
            >
              <TruncatedValue value={ `Block #${ height }` } w="100%"/>
            </Heading>
            <Box mt={ 2 } color="text_secondary">
              <Box fontWeight={ 600 }>Estimated target date</Box>
              <Box>{ dayjs().add(Number(data.result.EstimateTimeInSec), 's').format('llll') }</Box>
            </Box>
            <Flex columnGap={ 2 } mt={ 3 }>
              <LinkExternal
                variant="subtle"
                fontSize="sm"
                lineHeight="20px"
                px={ 2 }
                display="inline-flex"
                href={ createGoogleCalendarLink({ blockHeight: height, timeFromNow: Number(data.result.EstimateTimeInSec) }) }
              >
                <Image src="/static/google_calendar.svg" alt="Google calendar logo" boxSize={ 5 } mr={ 2 }/>
                <span>Google</span>
              </LinkExternal>
              <Button
                variant="subtle"
                fontWeight={ 400 }
                px={ 2 }
                size="sm"
                bgColor={ buttonBgColor }
                display="inline-flex"
                onClick={ handleAddToAppleCalClick }
              >
                <Image src="/static/apple_calendar.svg" alt="Apple calendar logo" boxSize={ 5 } mr={ 2 }/>
                <span>Apple</span>
              </Button>
            </Flex>
          </Box>
          <IconSvg name="block_slim" w={{ base: '65px', lg: '125px' }} h={{ base: '75px', lg: '140px' }} color={ iconColor } flexShrink={ 0 }/>
        </Flex>
        { data.result.EstimateTimeInSec && (
          <BlockCountdownTimer
            value={ Math.ceil(Number(data.result.EstimateTimeInSec)) }
            onFinish={ handleTimerFinish }
          />
        ) }
        <Grid gridTemplateColumns="repeat(2, calc(50% - 4px))" columnGap={ 2 } mt={ 2 }>
          <StatsWidget label="Remaining blocks" value={ data.result.RemainingBlock } icon="apps_slim"/>
          <StatsWidget label="Current block" value={ data.result.CurrentBlock } icon="block_slim"/>
        </Grid>
      </Flex>
    </Center>
  );
};

export default React.memo(BlockCountdown);
