/* eslint-disable */
import React from 'react';


const WithTextWrapper = ({ children , text }: {
    children: React.ReactNode;
    text: string;
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', width: '100%' }}>
            <div style={{ 
                color: '#000',
                fontFamily: 'HarmonyOS Sans',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%',
                textAlign: 'left',
                userSelect: 'none',
            }}>
                {text}
            </div>
            <div style={{  width: '100%' }}>
                {children}
            </div>
        </div>
    );
}

export default WithTextWrapper;