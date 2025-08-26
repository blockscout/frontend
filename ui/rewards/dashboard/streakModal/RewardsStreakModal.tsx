import { Flex, Text, Separator } from '@chakra-ui/react';
import React from 'react';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';

import BadgeCard from './BadgeCard';
import ProgressSegment from './ProgressSegment';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  badges: GetAvailableBadgesResponse['items'];
};

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
                  { badges.map((badge, i) => (
                    <ProgressSegment
                      key={ i }
                      target={ Number(badge.requirements?.streak || 0) }
                      prevTarget={ i > 0 ? Number(badges[i - 1]?.requirements?.streak || 0) : 0 }
                      currentStreak={ currentStreak }
                      isFirst={ i === 0 }
                      isFilled={ badge.is_whitelisted || badge.is_minted }
                    />
                  )) }
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" gap={ 3 }>
              <Heading level="3">Rewards</Heading>
              <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 6 }} justifyContent="space-between">
                { badges.map((badge, i) => (
                  <>
                    <BadgeCard
                      key={ i }
                      badge={ badge }
                      currentStreak={ currentStreak }
                      index={ i }
                    />
                    { i < badges.length - 1 && (
                      <Separator
                        display={{ base: 'none', md: 'block' }}
                        orientation="vertical"
                        borderColor={{ _light: 'blackAlpha.100', _dark: 'whiteAlpha.100' }}
                      />
                    ) }
                  </>
                )) }
              </Flex>
            </Flex>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsStreakModal;
