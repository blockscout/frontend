import Airtable from 'airtable';
import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

import type { UserRatings, AppRatings } from 'types/client/marketplace';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { ADDRESS_COUNTERS } from 'stubs/address';

const feature = config.features.marketplace;
const base = (feature.isEnabled && feature.rating) ?
  new Airtable({ apiKey: feature.rating.airtableApiKey }).base(feature.rating.airtableBaseId) :
  undefined;

export default function useRatings() {
  const { address } = useAccount();

  const addressCountersQuery = useApiQuery<'address_counters', { status: number }>('address_counters', {
    pathParams: { hash: address },
    queryOptions: {
      enabled: Boolean(address),
      placeholderData: ADDRESS_COUNTERS,
      refetchOnMount: false,
    },
  });

  const [ ratings, setRatings ] = useState<AppRatings>({});
  const [ userRatings, setUserRatings ] = useState<UserRatings>({});
  const [ isRatingLoading, setIsRatingLoading ] = useState<boolean>(false);
  const [ isUserRatingLoading, setIsUserRatingLoading ] = useState<boolean>(false);
  const [ isSending, setIsSending ] = useState<boolean>(false);
  const [ canRate, setCanRate ] = useState<boolean | undefined>(undefined);

  const fetchRatings = useCallback(async() => {
    if (!base) {
      return;
    }
    const data = await base('apps_ratings').select({ fields: [ 'appId', 'rating' ] }).all();
    const ratings = data.reduce((acc: AppRatings, record) => {
      const fields = record.fields as { appId: string; rating: number };
      acc[fields.appId] = {
        recordId: record.id,
        rating: fields.rating,
      };
      return acc;
    }, {});
    setRatings(ratings);
  }, []);

  useEffect(() => {
    async function fetch() {
      setIsRatingLoading(true);
      await fetchRatings();
      setIsRatingLoading(false);
    }
    fetch();
  }, [ fetchRatings ]);

  useEffect(() => {
    async function fetchUserRatings() {
      setIsUserRatingLoading(true);
      let userRatings = {} as UserRatings;
      if (address && base) {
        const data = await base('users_ratings').select({
          filterByFormula: `address = "${ address }"`,
          fields: [ 'appId', 'rating' ],
        }).all();
        userRatings = data.reduce((acc: UserRatings, record) => {
          const fields = record.fields as { appId: string; rating: number };
          if (!fields.appId || typeof fields.rating !== 'number') {
            return acc;
          }
          acc[fields.appId] = fields.rating;
          return acc;
        }, {});
      }
      setUserRatings(userRatings);
      setIsUserRatingLoading(false);
    }
    fetchUserRatings();
  }, [ address ]);

  useEffect(() => {
    const { isPlaceholderData, data } = addressCountersQuery;
    const canRate = address && !isPlaceholderData && Number(data?.transactions_count) >= 10;
    setCanRate(canRate);
  }, [ address, addressCountersQuery ]);

  const rateApp = useCallback(async(appId: string, recordId: string | undefined, rating: number) => {
    if (!address || !base || !recordId) {
      return;
    }
    setIsSending(true);
    try {
      await base('users_ratings').create([
        {
          fields: {
            address,
            appRecordId: [ recordId ],
            rating,
          },
        },
      ]);
      setUserRatings({ ...userRatings, [appId]: rating });
      fetchRatings();
    } catch (error) {}
    setIsSending(false);
  }, [ address, userRatings, fetchRatings ]);

  return {
    ratings,
    userRatings,
    rateApp,
    isSendingRating: isSending,
    isRatingLoading,
    isUserRatingLoading,
    canRate,
  };
}
