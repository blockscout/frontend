/* eslint-disable */
import React from 'react';

import {
    IconButton,
} from "@chakra-ui/react";


const CustomModalClose = ({
    onClose,
}: {
    onClose: () => void;
}) => {

    return  (
        <IconButton
            icon={
                <span
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundSize: 'contain',
                        cursor: 'pointer',
                    }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5.87598 5.875L14.1256 14.1246" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.124 5.875L5.87444 14.1246" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            }
            aria-label="Close modal"
            variant="ghost"
            onClick={onClose}
        />
    );

}
