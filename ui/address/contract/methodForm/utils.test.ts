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
      '0:0:3:0': undefined,
      '0:0:3:1': undefined,
      '0:0:3:2': undefined,
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
          ],
        ],
        '0:1',
      ],
      '1',
      '2',
    ]);
  });
});
