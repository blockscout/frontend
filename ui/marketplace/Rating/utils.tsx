import React from 'react';

export const getTooltipText = (canRate: boolean | undefined) => {
  if (canRate === undefined) {
    return <>You need a connected wallet to leave your rating.<br/>Link your wallet to Blockscout first</>;
  }
  if (!canRate) {
    return <>New wallet users are not eligible to leave ratings.<br/>Please connect a different wallet</>;
  }
  return <>Ratings are derived from reviews by trusted users.<br/>Click here to rate!</>;
};
