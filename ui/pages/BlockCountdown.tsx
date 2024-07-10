import { Box, Center, Flex, Heading, Image, useColorModeValue, Grid, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import downloadBlob from 'lib/downloadBlob';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
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

  const { data, isFetching, isError, error } = useApiQuery('block_countdown', {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });

  const handleAddToAppleCalClick = React.useCallback(() => {
    const fileBlob = createIcsFileBlob({ blockHeight: height, date: dayjs().add(Number(data?.result.EstimateTimeInSec), 's') });
    downloadBlob(fileBlob, `Block #${ height } creation event.ics`);
  }, [ data?.result.EstimateTimeInSec, height ]);

  if (isFetching) {
    return <Center h="100%"><ContentLoader/></Center>;
  }

  if (isError) {
    throwOnResourceLoadError({ isError, error, resource: 'block_countdown' });
  }

  return (
    <Center h="100%" alignItems={{ base: 'flex-start', lg: 'center' }}>
      <Flex flexDir="column">
        <Flex columnGap={ 8 } alignItems="flex-start" justifyContent={{ base: 'space-between', lg: undefined }}>
          <div>
            <Heading
              fontSize={{ base: '18px', lg: '32px' }}
              lineHeight={{ base: '24px', lg: '40px' }}
              h="40px"
              maxW={{ base: '100%', lg: '500px' }}
            >
              <TruncatedValue value={ `Block #${ height }` } w="100%"/>
            </Heading>
            <Box mt={ 2 } color="text_secondary">
              <Box fontWeight={ 600 }>Estimated target date</Box>
              <Box>{ dayjs().add(Number(data?.result.EstimateTimeInSec), 's').format('llll') }</Box>
            </Box>
            <Flex columnGap={ 2 } mt={ 3 }>
              <LinkExternal
                variant="subtle"
                fontSize="sm"
                lineHeight="20px"
                px={ 2 }
                display="inline-flex"
                href={ createGoogleCalendarLink({ blockHeight: height, timeFromNow: Number(data?.result.EstimateTimeInSec) }) }
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
          </div>
          <IconSvg name="block_slim" w={{ base: '65px', lg: '125px' }} h={{ base: '75px', lg: '140px' }} color={ iconColor }/>
        </Flex>
        <Grid gridTemplateColumns="repeat(2, calc(50% - 4px))" columnGap={ 2 } mt={ 2 }>
          <StatsWidget label="Remaining blocks" value={ data?.result.RemainingBlock } icon="apps_slim"/>
          <StatsWidget label="Current block" value={ data?.result.CurrentBlock } icon="block_slim"/>
        </Grid>
      </Flex>
    </Center>
  );
};

export default React.memo(BlockCountdown);
