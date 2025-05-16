import {
  Grid,
  GridItem,
  Text,
  Link,
  Tbody,
  Thead,
  Table,
  Th,
  Tr,
  Td,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';
import { formatUnits } from 'viem';

import config from 'configs/app';
import type { Epoch } from 'lib/getEpochById';
import { space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import PrevNext from 'ui/shared/PrevNext';

interface Props {
  epochData: Epoch;
  isLoading: boolean;
}

const EpochDetails = ({ epochData, isLoading }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const router = useRouter();

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const handlePrevNextClick = React.useCallback(
    (direction: 'prev' | 'next') => {
      if (!epochData.id) {
        return;
      }

      const increment = direction === 'next' ? +1 : -1;
      const nextId = String(Number(BigInt(epochData.id)) + increment);

      router.push(
        {
          pathname: '/epoch/[id]',
          query: { id: nextId },
        },
        undefined,
      );
    },
    [ epochData, router ],
  );

  if (!epochData) {
    return null;
  }

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{
        base: 'minmax(0, 1fr)',
        lg: 'minmax(min-content, 200px) minmax(0, 1fr)',
      }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint="The current epoch is the active time period on the blockchain used for calculating rewards, validating transactions, and updating protocol state"
        isLoading={ isLoading }
      >
        Current Epoch
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading }>
          { parseInt(epochData.id, 16).toString() }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous epoch"
          nextLabel="View next epoch"
          isPrevDisabled={ Number(epochData.id) === 0 }
          isLoading={ isLoading }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ `Amount of ${
          config.chain.currency.symbol || 'native token'
        } generated from transactions since the first epoch.` }
        isLoading={ isLoading }
      >
        Total Base Reward
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading }>
          { BigNumber(
            Number(
              formatUnits(BigInt(epochData.totalBaseRewardWeight), 18),
            ).toFixed(2),
          ).toFormat() }{ ' ' }
          { currencyUnits.ether }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Date & time at which epoch was sealed."
        isLoading={ isLoading }
      >
        End Time
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <DetailsTimestamp
          timestamp={ Number(BigInt(epochData.endTime)) * 1000 }
          isLoading={ isLoading }
        />
      </DetailsInfoItem.Value>

      <>
        <DetailsInfoItem.Label
          hint="The total amount of fees collected during this epoch, based on network activity and gas usage"
          isLoading={ isLoading }
        >
          Total Epoch Fee
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          { isLoading ? (
            <Skeleton isLoaded={ !isLoading } h="20px" maxW="380px" w="100%"/>
          ) : (
            <>
              <Text>
                { BigNumber(
                  Number(formatUnits(BigInt(epochData.epochFee), 18)).toFixed(2),
                ).toFormat() }{ ' ' }
                { currencyUnits.ether }{ ' ' }
              </Text>
              <Text variant="secondary" whiteSpace="pre">
                { space }($)
              </Text>
            </>
          ) }
        </DetailsInfoItem.Value>
      </>

      { /* CUT */ }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="BlockDetails__cutLink">
          <Skeleton isLoaded={ !isLoading } mt={ 6 } display="inline-block">
            <Link
              fontSize="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              onClick={ handleCutClick }
            >
              All-Time Validator Rewards
            </Link>
          </Skeleton>
        </Element>
      </GridItem>

      { /* ADDITIONAL INFO */ }
      { isExpanded && !isLoading && (
        <>
          <GridItem
            colSpan={{ base: undefined, lg: 2 }}
            mt={{ base: 1, lg: 4 }}
          />

          <DetailsInfoItemDivider/>

          <GridItem
            colSpan={{ base: undefined, lg: 2 }}
            mt={{ base: 1, lg: 4 }}
          >
            <Table variant="simple" size="sm">
              <Thead top={ ACTION_BAR_HEIGHT_DESKTOP }>
                <Tr>
                  <Th columnGap={ 1 } width="50%">
                    Validator ID
                  </Th>
                  <Th columnGap={ 1 } width="50%">
                    Rewards
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                { epochData.actualValidatorRewards
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map((reward, index) => (
                    <Tr key={ index }>
                      <Td columnGap={ 1 }>{ reward.id }</Td>
                      <Td columnGap={ 1 }>
                        { BigNumber(
                          Number(
                            formatUnits(BigInt(reward.totalReward), 18),
                          ).toFixed(2),
                        ).toFormat() }{ ' ' }
                        { currencyUnits.ether }
                      </Td>
                    </Tr>
                  )) }
              </Tbody>
            </Table>
          </GridItem>
        </>
      ) }
    </Grid>
  );
};

export default EpochDetails;
