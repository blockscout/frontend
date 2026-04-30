import type { GasPriceInfo, GasPrices, HomeStats } from 'types/api/stats';

// Enrich a single gas tier with:
//  - computed USD fiat_price (gwei × 1e-9 × 21,000 gas × coin_price) when the backend omits it
//  - estimated confirmation time (based on average_block_time) when the backend returns null
function enrichGasTier(gas: GasPriceInfo | null, coinPrice: string | null, estimatedTimeMs: number | null): GasPriceInfo | null {
  if (!gas) {
    return gas;
  }
  const result = { ...gas };
  if (result.fiat_price === null && result.price !== null && coinPrice) {
    result.fiat_price = (Number(result.price) * 1e-9 * 21_000 * Number(coinPrice)).toString();
  }
  if (result.time === null && estimatedTimeMs !== null) {
    result.time = estimatedTimeMs;
  }
  return result;
}

// Enrich the full HomeStats gas data so the top bar and gas tracker page display correctly
// even when the blockscout backend doesn't populate fiat_price, time, or gas_price_updated_at.
//
// Block multipliers (1× / 3× / 5×) produce confirmation times matching the reference explorer:
//   fast ≈ 1 block, normal ≈ 3 blocks, slow ≈ 5 blocks.
export function enrichGasStats(data: HomeStats, dataUpdatedAt: number): HomeStats {
  if (!data.gas_prices) {
    return data;
  }
  const coinPrice = data.coin_price ?? null;
  const blockTime = data.average_block_time ?? 6_000; // ms; fallback to 6 s

  const enrichedGasPrices: GasPrices = {
    fast: enrichGasTier(data.gas_prices.fast, coinPrice, Math.round(blockTime)),
    average: enrichGasTier(data.gas_prices.average, coinPrice, Math.round(blockTime * 3)),
    slow: enrichGasTier(data.gas_prices.slow, coinPrice, Math.round(blockTime * 5)),
  };

  return {
    ...data,
    gas_prices: enrichedGasPrices,
    // Use the query fetch time as "Last update" when the backend doesn't supply a gas timestamp.
    gas_price_updated_at: data.gas_price_updated_at ?? new Date(dataUpdatedAt).toISOString(),
  };
}
