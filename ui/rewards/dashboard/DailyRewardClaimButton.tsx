import { Button, useBoolean } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';

import { SECOND } from 'lib/consts';
import { useRewardsContext } from 'lib/contexts/rewards';
import splitSecondsInPeriods from 'ui/blockCountdown/splitSecondsInPeriods';

const DailyRewardClaimButton = () => {
  const { balancesQuery, dailyRewardQuery, claim } = useRewardsContext();
  const [ isClaiming, setIsClaiming ] = useBoolean(false);
  const [ timeLeft, setTimeLeft ] = React.useState<string>('');

  const dailyRewardValue = useMemo(() =>
    dailyRewardQuery.data ?
      Number(dailyRewardQuery.data.daily_reward) + Number(dailyRewardQuery.data.pending_referral_rewards) :
      0,
  [ dailyRewardQuery.data ]);

  const handleClaim = useCallback(async() => {
    setIsClaiming.on();
    try {
      await claim();
      await Promise.all([
        balancesQuery.refetch(),
        dailyRewardQuery.refetch(),
      ]);
    } catch (error) {}
    setIsClaiming.off();
  }, [ claim, setIsClaiming, balancesQuery, dailyRewardQuery ]);

  useEffect(() => {
    if (!dailyRewardQuery.data?.reset_at) {
      return;
    }

    // format the date to be compatible with the Date constructor
    const formattedDate = dailyRewardQuery.data.reset_at.replace(' ', 'T').replace(' UTC', 'Z');
    const target = new Date(formattedDate).getTime();

    let interval: ReturnType<typeof setTimeout>; // eslint-disable-line prefer-const

    const updateCountdown = (target: number) => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const { hours, minutes, seconds } = splitSecondsInPeriods(Math.floor(difference / SECOND));
        setTimeLeft(`${ hours }:${ minutes }:${ seconds }`);
      } else {
        setTimeLeft('00:00:00');
        dailyRewardQuery.refetch();
        clearInterval(interval);
      }
    };

    updateCountdown(target);

    interval = setInterval(() => {
      updateCountdown(target);
    }, SECOND);

    return () => clearInterval(interval);
  }, [ dailyRewardQuery ]);

  return (
    <Button
      isDisabled={ !dailyRewardQuery.data?.available }
      onClick={ handleClaim }
      isLoading={ isClaiming || dailyRewardQuery.isPending || dailyRewardQuery.isFetching }
    >
      { dailyRewardQuery.data?.available ?
        `Claim ${ dailyRewardValue } Merits` :
        `Next claim in ${ timeLeft }`
      }
    </Button>
  );
};

export default DailyRewardClaimButton;
