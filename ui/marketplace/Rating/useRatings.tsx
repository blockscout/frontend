import Airtable from 'airtable';
import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

import type { AppRating } from 'types/client/marketplace';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import * as mixpanel from 'lib/mixpanel/index';
import { ADDRESS_COUNTERS } from 'stubs/address';
import { toaster } from 'toolkit/chakra/toaster';

const MIN_TRANSACTION_COUNT = 5;

const feature = config.features.marketplace;
const airtable = (feature.isEnabled && feature.rating) ?
  new Airtable({ apiKey: feature.rating.airtableApiKey }).base(feature.rating.airtableBaseId) :
  undefined;

export type RateFunction = (
  appId: string,
  appRecordId: string | undefined,
  userRecordId: string | undefined,
  rating: number,
  source: EventPayload<EventTypes.APP_FEEDBACK>['Source'],
) => void;

function formatRatings(data: Airtable.Records<Airtable.FieldSet>) {
  return data.reduce((acc: Record<string, AppRating>, record) => {
    const fields = record.fields as { appId: string | Array<string>; rating: number | undefined; count?: number };
    const appId = Array.isArray(fields.appId) ? fields.appId[0] : fields.appId;
    acc[appId] = {
      recordId: record.id,
      value: fields.rating,
      count: fields.count,
    };
    return acc;
  }, {});
}

export default function useRatings() {
  const { address } = useAccount();

  const addressCountersQuery = useApiQuery<'general:address_counters', { status: number }>('general:address_counters', {
    pathParams: { hash: address },
    queryOptions: {
      enabled: Boolean(address),
      placeholderData: ADDRESS_COUNTERS,
      refetchOnMount: false,
    },
  });

  const [ ratings, setRatings ] = useState<Record<string, AppRating>>({});
  const [ userRatings, setUserRatings ] = useState<Record<string, AppRating>>({});
  const [ isRatingLoading, setIsRatingLoading ] = useState<boolean>(false);
  const [ isUserRatingLoading, setIsUserRatingLoading ] = useState<boolean>(false);
  const [ isSending, setIsSending ] = useState<boolean>(false);
  const [ canRate, setCanRate ] = useState<boolean | undefined>(undefined);

  const fetchRatings = useCallback(async() => {
    if (!airtable) {
      return;
    }
    try {
      const data = await airtable('apps_ratings').select({ fields: [ 'appId', 'rating', 'count' ] }).all();
      const ratings = formatRatings(data);
      setRatings(ratings);
    } catch (error) {
      toaster.error({
        title: 'Error loading ratings',
        description: 'Please try again later',
      });
    }
  }, [ ]);

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
      let userRatings = {} as Record<string, AppRating>;
      if (address && airtable) {
        try {
          const data = await airtable('users_ratings').select({
            filterByFormula: `address = "${ address }"`,
            fields: [ 'appId', 'rating' ],
          }).all();
          userRatings = formatRatings(data);
        } catch (error) {
          toaster.error({
            title: 'Error loading user ratings',
            description: 'Please try again later',
          });
        }
      }
      setUserRatings(userRatings);
      setIsUserRatingLoading(false);
    }
    fetchUserRatings();
  }, [ address ]);

  useEffect(() => {
    const isPlaceholderData = addressCountersQuery?.isPlaceholderData;
    const transactionsCount = addressCountersQuery?.data?.transactions_count;
    const canRate = address && !isPlaceholderData && Number(transactionsCount || 0) >= MIN_TRANSACTION_COUNT;
    setCanRate(canRate);
  }, [ address, addressCountersQuery?.isPlaceholderData, addressCountersQuery?.data?.transactions_count ]);

  const rateApp = useCallback(async(
    appId: string,
    appRecordId: string | undefined,
    userRecordId: string | undefined,
    rating: number,
    source: EventPayload<EventTypes.APP_FEEDBACK>['Source'],
  ) => {
    setIsSending(true);

    try {
      if (!address || !airtable) {
        throw new Error('Address is missing');
      }

      if (!appRecordId) {
        const records = await airtable('apps_ratings').create([ { fields: { appId } } ]);
        appRecordId = records[0].id;
        if (!appRecordId) {
          throw new Error('Record ID is missing');
        }
      }

      if (!userRecordId) {
        const userRecords = await airtable('users_ratings').create([
          {
            fields: {
              address,
              appRecordId: [ appRecordId ],
              rating,
            },
          },
        ]);
        userRecordId = userRecords[0].id;
      } else {
        await airtable('users_ratings').update(userRecordId, { rating });
      }

      setUserRatings({
        ...userRatings,
        [appId]: {
          recordId: userRecordId,
          value: rating,
        },
      });
      fetchRatings();

      toaster.success({
        title: 'Awesome! Thank you 💜',
        description: 'Your rating improves the service',
      });
      mixpanel.logEvent(
        mixpanel.EventTypes.APP_FEEDBACK,
        { Action: 'Rating', Source: source, AppId: appId, Score: rating },
      );
    } catch (error) {
      toaster.error({
        title: 'Ooops! Something went wrong',
        description: 'Please try again later',
      });
    }

    setIsSending(false);
  }, [ address, userRatings, fetchRatings ]);

  return {
    ratings,
    userRatings,
    rateApp,
    isRatingSending: isSending,
    isRatingLoading,
    isUserRatingLoading,
    canRate,
  };
}
