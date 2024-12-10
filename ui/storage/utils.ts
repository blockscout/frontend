export const formatPubKey = (pubKey: string | undefined, _length = 4, _preLength = 4, settingDate = 0) => {
  if (pubKey && pubKey.toString().length <= settingDate) {
    return pubKey;
  }
  if (!pubKey) {
    return;
  }
  if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
    return pubKey;
  }
  return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
};

export const truncateString = (str: string, _length = 32): string => {
  if (str.length > _length) {
    return str.slice(0, _length) + '...';
  }
  return str;
};

export const timeTool = (time: string) => {
  const now = new Date().getTime();
  const diff = now - new Date(time).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${ years } year ago`;
  }
  if (months > 0) {
    return `${ months } month ago`;
  }
  if (days > 0) {
    return `${ days } day ago`;
  }
  if (hours > 0) {
    return `${ hours } hours ${ minutes % 60 > 0 ? (minutes % 60) + 'm ago' : 'ago' }`;
  }
  if (minutes > 0) {
    return `${ minutes } minute ago`;
  }
  return `${ seconds } seconds ago`;
};

export const timeText = (time: string) => {
  const oldyear = new Date(time).getFullYear();
  const oldmonth = new Date(time).getMonth() + 1;
  const oldday = new Date(time).getDate();
  const oldhours = new Date(time).getHours();
  const oldminutes = new Date(time).getMinutes();
  const oldseconds = new Date(time).getSeconds();
  const timeText = `${ oldyear }-${ oldmonth }-${ oldday } 
  ${ oldhours }:${ oldminutes.toString().padStart(2, '0') }:${ oldseconds.toString().padStart(2, '0') } (UTC+8)`;
  return timeText;
};

export const sizeTool = (bytes: number) => {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const skeletonList = (storageName: string) => {
  const list = [];
  if (storageName.replace('/', '') === 'object') {
    for (let index = 0; index < 10; index++) {
      list.push({
        'Object Name': 'Object Name',
        Creator: 'Creator',
        Type: 'Type',
        'Object Size': 'Object Size',
        Status: 'Status',
        Visibility: 'visibility',
        'Last Updated Time': 'Time',
        Bucket: 'Bucket',
      });
    }
  } else if (storageName.replace('/', '') === 'bucket') {
    for (let index = 0; index < 10; index++) {
      list.push({
        'Bucket Name': 'Bucket Name',
        'Bucket ID': 'Bucket ID',
        'Last Updated Time': 'Last Updated Time',
        Status: 'Status',
        'Active Objects Count': 'Active Objects Count',
        Creator: 'Creator',
      });
    }
  } else {
    for (let index = 0; index < 10; index++) {
      list.push({
        'Group Name': 'Group Name',
        'Group ID': 'Group ID',
        'Last Updated': 'Last Updated',
        Status: 'Status',
        'Active Objects Count': 'Active Objects Count',
        Owner: 'Owner',
      });
    }
  }
  return list;
};

export const isNumberOnly = (str: string) => {
  return /^\d+$/.test(str);
};
