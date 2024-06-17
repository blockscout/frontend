import { transformFormDataToMethodArgs } from './utils';

describe('transformFormDataToMethodArgs', () => {
  it('should transform form data to method args array', () => {
    const formData = {
      '1': '1',
      '2': '2',
      '0:1': '0:1',
      '0:0:0': '0:0:0',
      '0:0:1:0': '0:0:1:0',
      '0:0:1:3': '0:0:1:3',
      '0:0:2:1:0': '0:0:2:1:0',
      '0:0:2:1:1': '0:0:2:1:1',
      '0:0:2:2:0': '0:0:2:2:0',
      '0:0:2:2:2': '0:0:2:2:2',
      '0:0:2:5:3': '0:0:2:5:3',
      '0:0:2:5:8': '0:0:2:5:8',
    };
    const result = transformFormDataToMethodArgs(formData);
    expect(result).toEqual([
      [
        [
          '0:0:0',
          [
            '0:0:1:0',
            '0:0:1:3',
          ],
          [
            [
              '0:0:2:1:0',
              '0:0:2:1:1',
            ],
            [
              '0:0:2:2:0',
              '0:0:2:2:2',
            ],
            [
              '0:0:2:5:3',
              '0:0:2:5:8',
            ],
          ],
        ],
        '0:1',
      ],
      '1',
      '2',
    ]);
  });

  it('should leave the arg if it is an empty array', () => {
    const formData = {
      // simple array
      '0:0': undefined,

      // nested array
      '1:0:0': undefined,
      '1:1:0': '1',
      '1:1:1': '2',

      // array in a tuple
      '2:0': 'duck',
      '2:1:0': undefined,
    };
    const result = transformFormDataToMethodArgs(formData);
    expect(result).toEqual([
      [],
      [
        [],
        [ '1', '2' ],
      ],
      [
        'duck',
        [],
      ],
    ]);
  });
});
