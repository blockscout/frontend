/* eslint-disable */
import React from 'react';



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
                    { price }
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
                    Moca
                </div>
            </div>
        </div>
    )
}

export default ReadOnlyInput;