/* eslint-disable */
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Button , Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import PlainButton from './PlainButton';

const icon_calendar = (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
        <path d="M2.5 6H14.5M11.8333 8.66758L5.16667 8.66667M7.38889 11.3336L5.16667 11.3333M5.16667 2V3.33333M11.8333 2V3.33333M4.63333 14H12.3667C13.1134 14 13.4868 14 13.772 13.8547C14.0229 13.7268 14.2268 13.5229 14.3547 13.272C14.5 12.9868 14.5 12.6134 14.5 11.8667V5.46667C14.5 4.71993 14.5 4.34656 14.3547 4.06135C14.2268 3.81046 14.0229 3.60649 13.772 3.47866C13.4868 3.33333 13.1134 3.33333 12.3667 3.33333H4.63333C3.8866 3.33333 3.51323 3.33333 3.22801 3.47866C2.97713 3.60649 2.77316 3.81046 2.64532 4.06135C2.5 4.34656 2.5 4.71993 2.5 5.46667V11.8667C2.5 12.6134 2.5 12.9868 2.64532 13.272C2.77316 13.5229 2.97713 13.7268 3.22801 13.8547C3.51323 14 3.8866 14 4.63333 14Z" stroke="#FF57B7" 
        strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const ConfigProvider = dynamic(() => import('antd/es/config-provider'), { ssr: false, });
const DatePicker = dynamic(async () => {
    const DatePicker = await import('antd/es/date-picker');

    return DatePicker.default.RangePicker;
}, { ssr: false, });

const DatePickerFilter = ({
    value,
    isDisabled = false,
    setValue,
}: {
    value: any;
    isDisabled?: boolean;
    setValue: (val: any) => void;
}) => {

    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState<any>(value);
    const [ shouldClose , setShouldClose ] = useState<boolean>(false);
    
    const allowClose =  React.useMemo(() => {
        if ( dates[0] && dates[1]) {
            return true;
        }
        return false;
    } , [dates]);

    const handleCalendarChange = (val: any) => {
        setDates(val);
    };


    const handleConfirmSelect = () => {
        setValue(dates);
        setShouldClose(true);
    }

    const handleCancelSelect = () => {
        console.log('Cancel Select');
        setShouldClose(true);
    }


    const handleChange = (val: any) => {
        setDates(val);
        setOpen(false);
    };


    useEffect(() => {
        if (shouldClose) {
            setOpen(false);
            setShouldClose(false);
        }
    }, [shouldClose]);


    useEffect(() => {
        if(open) {
            setShouldClose(false);
        }
    }, [open]);


    return (
        <div className="date-picker-filter" style={{ width: '100%', height: 'auto', transform: 'translateY(-16px)'}}>
            <ConfigProvider
                theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#FF57B7',
                },
                }}
            >
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                    }}
                    style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px'}}>
                    <DatePicker 
                        style={{ width: '100%', height: '42px', 
                            borderRadius: 9999, border: '1px solid rgba(0, 46, 51, 0.10)',
                            fontSize: '12px', color: 'rgba(0, 0, 0, 0.30)',
                            fontWeight: 400, fontStyle: 'normal'
                        }}
                        className="stake-date-picker"
                        showNow={false}
                        value={value}
                        disabled={isDisabled}
                        open={open}
                        separator = {
                            <span style={{ padding: 0 }}>
                                -
                            </span>
                        }
                        onOpenChange={(o: boolean) => {}}
                        onCalendarChange={handleCalendarChange}
                        onChange={handleChange}
                        needConfirm = {false}
                        format="YYYY.MM.DD"
                        prefix= { icon_calendar }
                        suffixIcon={ null } 
                        placeholder={['From Date', 'End Date']}
                        renderExtraFooter={() => (
                            <Flex 
                                justifyContent='flex-end'
                                alignItems="center"
                                padding="12px 0"
                                gap="8px"
                                width="100%"
                            >
                                <PlainButton 
                                    text={ "Cancel" }
                                    onClick={ handleCancelSelect }
                                    disabled={ false }
                                    width="48px"
                                    height="24px"
                                    bgColor="transparent"
                                    disabledBgColor="transparent"
                                    textColor="#FF57B7" 
                                    fontSize="12px"
                                    disabledTextColor="rgba(255, 87, 183, 0.5)"
                                />
                                <PlainButton 
                                    text={ "OK" }
                                    onClick={ handleConfirmSelect }
                                    disabled={ !allowClose }
                                    isSubmitting={ false }
                                    width="48px"
                                    height="24px"
                                    fontSize="12px"
                                />
                            </Flex>
                        )}
                    />
                </div>
            </ConfigProvider>
        </div>
    );
}
export default DatePickerFilter;