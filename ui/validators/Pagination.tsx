/* eslint-disable */

"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Pagination = dynamic(() => import('antd/es/pagination'), { ssr: false, });
const ConfigProvider = dynamic(() => import('antd/es/config-provider'), { ssr: false, });

const App: React.FC = () => (

    <ConfigProvider
        theme={{
        token: {
            // Seed Token
            colorPrimary: '#FFCBEC',
        },
        }}
    >
        <div style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px'}}>
            <Pagination defaultCurrent={1} total={50} />
        </div>
    </ConfigProvider>
)


export default App;