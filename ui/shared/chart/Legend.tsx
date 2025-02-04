import BigNumber from 'bignumber.js';
import React from 'react';

export interface LegendItem {
  label: string;
  color: string;
  value: number;
}

export interface LegendProps {
  items: Array<LegendItem>;
}

const Legend = ({ items }: LegendProps) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}
    >
      { items.map((item, index) => (
        <div
          key={ index }
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '5px',
              height: '20px',
              backgroundColor: item.color,
              marginRight: '8px',
            }}
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '20px',
            }}
          >
            <div className="">{ item.label }</div>{ ' ' }
            <div className="">{ BigNumber(item.value).toFormat(2) } RWA</div>
          </div>
        </div>
      )) }
    </div>
  );
};

export default Legend;
