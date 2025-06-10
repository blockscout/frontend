/* eslint-disable */
import React from 'react';
import { Avatar, Flex, Text } from '@chakra-ui/react';
import Decimal from 'decimal.js';

const amountFormat = (amount: string) => {
    const v = Number(amount);
    if (isNaN(v)) {
        return amount;
    }
    return v.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
    });
}


const truncate_4_decimal_AmountWithComma = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '-';
  }

  const num = Number(value);

  if (num === 0) return '0';
  if (num > 0 && num < 0.0001) return '<0.0001';

  const sum = new Decimal(num).mul(10000).toNumber(); // 乘以10000以便截断到小数点后四位
  // 截断到小数点后四位
  const truncated = new Decimal( Math.trunc(sum) ).div(10000).toNumber();
  
  const [intPartStr, decPart = ''] = truncated.toString().split('.');
  // 拼接小数部分
  if (decPart === '') {
    return intPartStr;
  } else {
    return `${intPartStr}.${decPart.slice(0, 4)}`;
  }
};

const ReadOnlyInput = ({
    amount,
    priceStr,
    children = null
}: {
    amount: string;
    priceStr: string;
    children?: React.ReactNode | null;
}) => {

    console.log('ReadOnlyInput amount:', amount, 'priceStr:', priceStr);

    return (
        <div 
            style={{
                width: '100%',
                height: 'auto',
                borderRadius: '16px',
                border: '1px solid rgba(0, 46, 51, 0.10)',
                backgroundColor: '#fff',
                padding: '16px',
                userSelect: 'none',
            }}
        >
            <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
                <span 
                    style={{
                        fontFamily: "HarmonyOS Sans",
                        fontSize: '40px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '140%',
                        color: '#FF57B7',
                        textAlign: 'left',
                    }}
                >
                    { truncate_4_decimal_AmountWithComma(amount) }
                </span>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '20px',
                    marginTop: '8px',
                    fontFamily: "HarmonyOS Sans",
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%',
                    color: 'rgba(0, 0, 0, 0.30)',
                }}>
                    <span>${ priceStr }</span>
                    <span>{ children } </span>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '18px',
                    right: 0,
                    fontFamily: "HarmonyOS Sans",
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%',
                    color: '#000000',
                }}>
                    <Flex flexDirection={'row'} width='auto' gap={"4px"} height='auto' alignItems='center' justifyContent={'flex-end'}>
                        <img
                            style={{ borderRadius: '50%' , flexShrink: 0}}
                            src="/static/moca-brand.svg"
                            draggable={false}
                            width="20px"
                            height="20px"
                        />
                        <Text
                            fontSize="14px"
                            fontWeight="500"
                            color="rgba(0, 0, 0, 0.60)"
                            textAlign="center"
                            fontStyle="normal"
                            lineHeight="normal"
                            fontFamily="HarmonyOS Sans"
                        >
                          MOCA
                        </Text>
                    </Flex>
                </div>
            </div>
        </div>
    )
}

export default ReadOnlyInput;