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
            setShouldClose(false);
        }
    };

    useEffect(() => {
        if (shouldClose) {
            setOpen(false);
            setShouldClose(false);
        }
    }, [shouldClose]);

    const renderExtraFooter = () => {
        return (
            <Flex 
                justifyContent='flex-end'
                alignItems="center"
                padding="8px 0"
                gap="8px"
                width="100%"
            >
                <Button
                    onClick={() => {
                        setShouldClose(true);
                    }}
                    variant="solid"
                    size="sm"
                    colorScheme="gray"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setShouldClose(true);
                    }}
                    variant="solid"
                    size="sm"
                    colorScheme="pink"
                >
                    Confirm
                </Button>
            </Flex>
        );
    };

    const handleChange = (val: any) => {
        setValue(val);
        setDates([]);
        setOpen(false);
    };

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
                        setShouldClose(false);
                    }}
                    style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px'}}>
                    <DatePicker 
                        style={{ width: '200px' }}
                        showNow={false}
                        value={value}
                        open={open}
                        onOpenChange={(o: boolean) => {
                            if (!shouldClose) {
                                setOpen(true);
                            } else {
                                setOpen(o);
                            }
                        }}
                        onCalendarChange={handleCalendarChange}
                        onChange={handleChange}
                        needConfirm = {false}
                        renderExtraFooter={renderExtraFooter}
                    />
                </div>
            </ConfigProvider>
        </div>
    );
}
export default DatePickerFilter;