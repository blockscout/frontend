export type MediaType = 'image' | 'video';

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
