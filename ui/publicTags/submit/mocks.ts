import type { FormSubmitResultItem } from './types';

const address1 = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';
const address2 = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5858';
const address3 = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5857';
const address4 = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5856';
const address5 = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5855';

const responseBaseFields = {
  requesterName: 'John Doe',
  requesterEmail: 'jonh.doe@duck.me',
  companyName: 'DuckDuckMe',
  companyWebsite: 'https://duck.me',
  description: 'Quack quack',
};

const tag1 = {
  name: 'Unicorn Uproar',
  tagType: 'name' as const,
  meta: {
    tagUrl: 'https://example.com',
    bgColor: '#ff1493',
    textColor: '#FFFFFF',
    tooltipDescription: undefined,
  },
};

const tag2 = {
  name: 'Hello',
  tagType: 'generic' as const,
  meta: {
    tooltipDescription: 'Hello, it is me... I was wondering if after all these years you would like to meet',
  },
};

const tag3 = {
  name: 'duck owner 🦆',
  tagType: 'classifier' as const,
  meta: {
    bgColor: '#fff300',
  },
};

export const allSuccessResponses: Array<FormSubmitResultItem> = [
  address1,
  address2,
  address3,
  address4,
  address5,
]
  .map((address) => ([ tag1, tag2, tag3 ].map((tag) => ({
    error: null,
    payload: {
      ...responseBaseFields,
      ...tag,
      address,
    },
  }))))
  .flat();
