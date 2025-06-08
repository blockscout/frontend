/* eslint-disable */
import React from 'react';
import { Avatar, Flex, Text } from '@chakra-ui/react';


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




const ReadOnlyInput = ({
    amount,
    price,
}: {
    amount: string;
    price: string;
}) => {

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
                    { amountFormat(amount) }
                </span>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    height: '20px',
                    marginTop: '8px',
                    fontFamily: "HarmonyOS Sans",
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%',
                    color: 'rgba(0, 0, 0, 0.30)',
                }}>
                    ${ price }
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
                          Moca
                        </Text>
                    </Flex>
                </div>
            </div>
        </div>
    )
}

export default ReadOnlyInput;