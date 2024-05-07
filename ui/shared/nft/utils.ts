export type MediaType = 'image' | 'video' | 'html';

const IMAGE_EXTENSIONS = [
  '.jpg', 'jpeg',
  '.png',
  '.gif',
  '.svg',
];

const VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.ogg',
];

export function getPreliminaryMediaType(url: string): MediaType | undefined {
  if (IMAGE_EXTENSIONS.some((ext) => url.endsWith(ext))) {
    return 'image';
  }

  if (url.startsWith('data:image')) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext))) {
    return 'video';
  }
}

export const mediaStyleProps = {
  transitionProperty: 'transform',
  transitionDuration: 'normal',
  transitionTimingFunction: 'ease',
  cursor: 'pointer',
  _hover: {
    base: {},
    lg: {
      transform: 'scale(1.2)',
    },
  },
};

export const videoPlayProps = {
  disablePictureInPicture: true,
  loop: true,
  muted: true,
  playsInline: true,
};
