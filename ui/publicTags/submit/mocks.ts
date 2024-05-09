import type { FormSubmitResultItem } from './types';

export const item1: FormSubmitResultItem = {
  error: null,
  payload: {
    addresses: [
      {
        hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254',
      },
    ],
    tags: [
      {
        name: 'hello',
        type: {
          label: 'name',
          value: 'name',
        },
        url: 'https://ohhhh.me',
        tooltipDescription: 'hello again',
        bgColor: 'add',
        textColor: '00aa11',
      },
    ],
    requesterName: 'tomm',
    requesterEmail: 'tom@ohhhh.me',
    companyName: 'OHHHH',
    companyWebsite: 'https://ohhhh.me',
    description: 'chao',
    reCaptcha: 'xxxx',
  },
};
