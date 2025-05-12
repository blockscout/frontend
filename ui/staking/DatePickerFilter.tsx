/* eslint-disable */
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Button , Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const ConfigProvider = dynamic(() => import('antd/es/config-provider'), { ssr: false, });
const DatePicker = dynamic(async () => {
    const DatePicker = await import('antd/es/date-picker');

    return DatePicker.default.RangePicker;
}, { ssr: false, });

const DatePickerFilter = () => {

    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState<any>([]);
    const [value, setValue] = useState<any>([null, null]);
    const [ shouldClose , setShouldClose ] = useState<boolean>(false);

    const handleCalendarChange = (val: any) => {
        setDates(val);
        // 如果两个时间都选择完毕，可以自动打开“确认”按钮
        if (val[0] && val[1]) {
            setValue(val);
        }
    };


    const handleConfirmSelect = () => {
        console.log('Confirm Select', dates);
        setShouldClose(true);
    }

    const handleCancelSelect = () => {
        console.log('Cancel Select');
        setShouldClose(true);
    }


    const handleChange = (val: any) => {
        setValue(val);
        setDates([]);
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
        <div>
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
                    style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px'}}>
                    <DatePicker 
                        style={{ width: '204px', height: '42px', borderRadius: 9999 }}
                        showNow={false}
                        value={value}
                        open={open}
                        onOpenChange={(o: boolean) => {}}
                        onCalendarChange={handleCalendarChange}
                        onChange={handleChange}
                        needConfirm = {false}
                        format="YYYY-MM-DD"
                        placeholder={['Start Date', 'End Date']}
                        renderExtraFooter={() => (
                            <Flex 
                                justifyContent='flex-end'
                                alignItems="center"
                                padding="8px 0"
                                gap="8px"
                                width="100%"
                            >
                                <Button
                                    onClick={ handleCancelSelect }
                                    variant="solid"
                                    size="sm"
                                    colorScheme="gray"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={ handleConfirmSelect }
                                    variant="solid"
                                    size="sm"
                                    colorScheme="pink"
                                >
                                    Confirm
                                </Button>
                            </Flex>
                        )}
                    />
                </div>
            </ConfigProvider>
        </div>
    );
}
export default DatePickerFilter;