import { Flex, Text, Progress } from '@chakra-ui/react';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';

const BADGE_BG_COLORS = [ '#DFE8F5', '#D2E5FE', '#EFE1FF' ];

type Props = {
  badge: GetAvailableBadgesResponse['items'][number];
  currentStreak: number;
  index: number;
};

export default function BadgeCard({ badge, currentStreak, index }: Props) {
  const target = Number(badge.requirements?.streak || 0);
  const isUnlocked = badge.is_whitelisted || badge.is_minted;
  const progress = Math.min(currentStreak, target);

  return (
    <Flex direction={{ base: 'row', md: 'column' }} alignItems="center" gap={ 3 } flex={ 1 }>
      <Flex
        p={{ base: 2.5, md: 4 }}
        borderRadius="lg"
        bgColor={ isUnlocked ? BADGE_BG_COLORS[index] : { _light: 'gray.50', _dark: 'whiteAlpha.100' } }
        alignItems="center"
        justifyContent="center"
        w={{ base: '92px', md: 'full' }}
        flexShrink={ 0 }
      >
        <Image
          src={ `/static/merits/streak_${ index + 1 }${ isUnlocked ? '' : '_ghost' }.png` }
          alt="Streak badge"
          h={{ base: '54px', md: '82px' }}
        />
      </Flex>
      <Flex direction="column" gap={ 3 } w="full" alignItems={{ base: 'flex-start', md: 'center' }}>
        <Text textStyle="sm">{ target } Day streak</Text>
        <Flex
          w="full"
          alignItems="center"
          justifyContent={{ base: 'flex-start', md: 'center' }}
          gap={ 2 }
          px={{ base: 0, md: 2 }}
          h="32px"
        >
          { (() => {
            if (badge.is_minted) {
              return (
                <Text textStyle="xs" color="green.500">
                  Minted
                </Text>
              );
            }
            if (badge.is_whitelisted) {
              return (
                <Link
                  href={ `https://badges.blockscout.com/mint/${ badge.address }` }
                  external
                  textStyle="sm"
                >
                  Mint a badge
                </Link>
              );
            }
            return (
              <>
                <Text textStyle="xs" color="text.secondary" minW="50px">
                  { progress }/{ target }
                </Text>
                <Progress.Root value={ progress } min={ 0 } max={ target } flex={ 1 } size="xs" variant="subtle">
                  <Progress.Track h="4px" bg={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}>
                    <Progress.Range bg="green.400"/>
                  </Progress.Track>
                </Progress.Root>
              </>
            );
          })() }
        </Flex>
      </Flex>
    </Flex>
  );
}
