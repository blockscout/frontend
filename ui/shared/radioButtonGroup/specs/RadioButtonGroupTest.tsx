import React from 'react';

import RadioButtonGroup from '../RadioButtonGroup';

type Test = 'v1' | 'v2' | 'v3';

const RadioButtonGroupTest = () => {
  return (
    <RadioButtonGroup<Test>
      // eslint-disable-next-line react/jsx-no-bind
      onChange={ () => {} }
      defaultValue="v1"
      name="test"
      options={ [
        { value: 'v1', title: 'test option 1', icon: 'clock', onlyIcon: false },
        { value: 'v2', title: 'test 2', onlyIcon: false },
        { value: 'v2', title: 'test 2', icon: 'clock', onlyIcon: true },
      ] }
    />
  );
};

export default RadioButtonGroupTest;
