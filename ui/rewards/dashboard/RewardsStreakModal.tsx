import { Flex, Text, Progress, Separator } from '@chakra-ui/react';
import React from 'react';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  badges: GetAvailableBadgesResponse['items'];
};

const BADGE_BG_COLORS = [ '#DFE8F5', '#D2E5FE', '#EFE1FF' ];

const RewardsStreakModal = ({ isOpen, onClose, currentStreak, badges }: Props) => {
  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) onClose();
  }, [ onClose ]);

  return (
    <DialogRoot open={ isOpen } onOpenChange={ handleOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <DialogHeader mb={ 3 }>Streak progress</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap={ 6 }>
            <Flex direction="column" gap={ 3 }>
              <Text textStyle="md">
                Build your streak day by day and unlock exclusive badges as a reward for staying consistent.
              </Text>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 4, md: 10 }}
                bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.100' }}
                p={{ base: 4, md: 8 }}
                pl={ 5 }
                borderRadius="lg"
                justifyContent="space-between"
              >
                <Flex direction="column" alignItems="center" gap={ 2 }>
                  <Heading level="1">{ currentStreak }</Heading>
                  <Text textStyle="xs" color="text.secondary">Day streak</Text>
                </Flex>
                <Flex flex={ 1 }>
                  { badges.map((badge, i) => {
                    const target = Number(badge.requirements?.streak || 0);
                    const prevTarget = i > 0 ? Number(badges[i - 1]?.requirements?.streak || 0) : 0;
                    const isDone = currentStreak >= target;
                    const progress = Math.min(Math.max(currentStreak, prevTarget), target);
                    return (
                      <Flex key={ i } gap={ 0 } flex={ 1 } minW="0">
                        <Flex flex={ 1 } alignItems="center" h="40px" mx={ -2.5 }>
                          <Progress.Root
                            value={ progress }
                            min={ prevTarget }
                            max={ target }
                            size="xs"
                            variant="subtle"
                            w="full"
                          >
                            <Progress.Track
                              h="4px"
                              bg={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
                              borderStartRadius={ i === 0 ? undefined : 0 }
                              borderEndRadius={ 0 }
                            >
                              <Progress.Range bg="green.400"/>
                            </Progress.Track>
                          </Progress.Root>
                        </Flex>
                        <Flex
                          direction="column"
                          alignItems="center"
                          gap={ 2 }
                          flexShrink={ 0 }
                          w="60px"
                        >
                          <Flex h="40px" alignItems="center">
                            <Flex
                              w="40px"
                              h="32px"
                              borderRadius="lg"
                              bgColor={ isDone ? 'green.400' : { _light: 'gray.200', _dark: 'whiteAlpha.200' } }
                              alignItems="center"
                              justifyContent="center"
                              zIndex={ 1 }
                            >
                              { isDone ? (
                                <IconSvg name="check" boxSize={ 5 } color="white"/>
                              ) : (
                                <IconSvg name="hexagon" boxSize={ 4 } color={{ _light: 'gray.400', _dark: 'whiteAlpha.500' }}/>
                              ) }
                            </Flex>
                          </Flex>
                          <Text textStyle="xs" color="text.secondary">{ target } Days</Text>
                        </Flex>
                      </Flex>
                    );
                  }) }
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" gap={ 3 }>
              <Heading level="3">Rewards</Heading>
              <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 6 }} justifyContent="space-between">
                { badges.map((badge, i) => {
                  const target = Number(badge.requirements?.streak || 0);
                  const isUnlocked = badge.is_qualified || badge.is_whitelisted || currentStreak >= target;
                  const progress = Math.min(currentStreak, target);
                  return (
                    <>
                      <Flex key={ target } direction={{ base: 'row', md: 'column' }} alignItems="center" gap={ 3 } flex={ 1 }>
                        <Flex
                          p={{ base: 2.5, md: 4 }}
                          borderRadius="lg"
                          bgColor={ isUnlocked ? BADGE_BG_COLORS[i] : { _light: 'gray.50', _dark: 'whiteAlpha.100' } }
                          alignItems="center"
                          justifyContent="center"
                          w={{ base: '92px', md: 'full' }}
                          flexShrink={ 0 }
                        >
                          <Image
                            src={ `/static/merits/streak_${ [ '50', '100', '150' ][i] }${ isUnlocked ? '' : '_ghost' }.png` }
                            alt="Streak badge"
                            h={{ base: '54px', md: '82px' }}
                          />
                        </Flex>
                        <Flex direction="column" gap={ 3 } w="full" alignItems={{ base: 'flex-start', md: 'center' }}>
                          <Text textStyle="sm">{ target } Day streak</Text>
                          { isUnlocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              w={{ base: 'auto', md: 'full' }}
                              disabled={ !badge.is_whitelisted }
                            >
                              Mint a badge
                            </Button>
                          ) : (
                            <Flex w="full" alignItems="center" justifyContent="space-between" gap={ 2 } px={{ base: 0, md: 2 }}>
                              <Text textStyle="xs" color="text.secondary" minW="50px">
                                { progress }/{ target }
                              </Text>
                              <Progress.Root value={ progress } min={ 0 } max={ target } flex={ 1 } size="xs" variant="subtle">
                                <Progress.Track h="4px" bg={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}>
                                  <Progress.Range bg="green.400"/>
                                </Progress.Track>
                              </Progress.Root>
                            </Flex>
                          ) }
                        </Flex>
                      </Flex>
                      { i < badges.length - 1 && (
                        <Separator
                          display={{ base: 'none', md: 'block' }}
                          orientation="vertical"
                          borderColor={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.100' }}
                        />
                      ) }
                    </>
                  );
                }) }
              </Flex>
            </Flex>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsStreakModal;
