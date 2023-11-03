import React from 'react';

import RadioButtonGroup from '../RadioButtonGroup';

const TestIcon = ({ className }: {className?: string}) => {
  return (
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={ className }>
      { /* eslint-disable-next-line max-len */ }
      <path fillRule="evenodd" clipRule="evenodd" d="M3.5 11a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0ZM11 1C5.477 1 1 5.477 1 11s4.477 10 10 10 10-4.477 10-10S16.523 1 11 1Zm1.25 5a1.25 1.25 0 1 0-2.5 0v5c0 .69.56 1.25 1.25 1.25h5a1.25 1.25 0 1 0 0-2.5h-3.75V6Z" fill="currentColor" stroke="transparent" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

type Test = 'v1' | 'v2' | 'v3';

const RadioButtonGroupTest = () => {
  return (
    <RadioButtonGroup<Test>
      // eslint-disable-next-line react/jsx-no-bind
      onChange={ () => {} }
      defaultValue="v1"
      name="test"
      options={ [
        { value: 'v1', title: 'test option 1', icon: TestIcon, onlyIcon: false },
        { value: 'v2', title: 'test 2', onlyIcon: false },
        { value: 'v2', title: 'test 2', icon: TestIcon, onlyIcon: true },
      ] }
    />
  );
};

export default RadioButtonGroupTest;
