import type { FormSubmitResultItem } from './types';

export const item1: FormSubmitResultItem = {
  error: null,
  payload: {
    addresses: [
      { hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51254' },
      { hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51255' },
      { hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51256' },
      { hash: '0xa8FCe579a11E551635b9c9CB915BEcd873C51257' },
    ],
    tags: [
      {
        name: 'hello',
        type: { label: 'name', value: 'name' },
        url: 'https://ohhhh.me',
        tooltipDescription: 'hello again',
        bgColor: 'add',
        textColor: '00aa11',
      },
      {
        name: 'hello it is me.. i was wondering if after all these years you would like to meet',
        type: { label: 'generic', value: 'generic' },
        url: undefined,
        tooltipDescription: undefined,
        bgColor: undefined,
        textColor: undefined,
      },
    ],
    requesterName: 'tommasdf jalskdfj asdflkjkas lasdfkj ',
    requesterEmail: 'tom@ohhhh.me',
    companyName: 'OHHHH',
    companyWebsite: 'https://ohhhh.me',
    description: 'chao',
    reCaptcha: 'xxxx',
  },
};
