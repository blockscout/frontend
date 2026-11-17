// @vitest-environment jsdom

import type { schemas } from '@blockscout/api-types';

import { toTokenInstanceModel } from 'src/slices/token/utils/model';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup, wrapper } from 'vitest/lib';

import useNftMediaInfo from './useNftMediaInfo';

const ADDRESS_HASH = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';
const OTHER_ADDRESS_HASH = '0x4C1C8E4D0F6F67F3B2B972D23746E1C925C95EE7';
const TOKEN_ID = '42';
const MEDIA_TYPE_PATH = `/api/v2/tokens/${ ADDRESS_HASH }/instances/${ TOKEN_ID }/media-type`;
const ANIMATION_URL = 'https://example.com/animation';
const IMAGE_URL = 'https://example.com/image';
const RESPONSE_INIT = { headers: { 'Content-Type': 'application/json' } };

type Field = 'animation_url' | 'image_url';

function toInstance(fields: Partial<schemas['TokenInstance']>) {
  return toTokenInstanceModel({ id: TOKEN_ID, ...fields });
}

async function resolveMediaInfo(fields: Partial<schemas['TokenInstance']>, field: Field = 'animation_url') {
  const data = toInstance(fields);
  const { result } = renderHook(
    () => useNftMediaInfo({ data, addressHash: ADDRESS_HASH, size: 'original', field, isEnabled: true }),
    { wrapper },
  );
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  return result.current.data;
}

function mockMediaTypeResponse(body: unknown, status = 200) {
  fetchMock.mockResponseOnce(JSON.stringify(body), { ...RESPONSE_INIT, status });
}

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(cleanup);

describe('useNftMediaInfo', () => {
  it('resolves nothing for an instance without the media URL', async() => {
    expect(await resolveMediaInfo({ animation_url: null })).toBeNull();
    expect(fetchMock.mock.calls).toHaveLength(0);
  });

  it('takes the type from the media MIME type when the URL is the media URL', async() => {
    const data = await resolveMediaInfo({ animation_url: ANIMATION_URL, media_url: ANIMATION_URL, media_type: 'video/mp4' });

    expect(data).toEqual([ { src: ANIMATION_URL, mediaType: 'video', transport: 'http' } ]);
    expect(fetchMock.mock.calls).toHaveLength(0);
  });

  it('falls through a MIME type that is neither image nor video', async() => {
    const url = `${ ANIMATION_URL }.webm`;
    const data = await resolveMediaInfo({ animation_url: url, media_url: url, media_type: 'text/html' });

    expect(data).toEqual([ { src: url, mediaType: 'video', transport: 'http' } ]);
  });

  it('takes the type from a known URL extension', async() => {
    const url = `${ IMAGE_URL }.png`;
    const data = await resolveMediaInfo({ image_url: url, image_media_type: 'html' }, 'image_url');

    expect(data).toEqual([ { src: url, mediaType: 'image', transport: 'http' } ]);
    expect(fetchMock.mock.calls).toHaveLength(0);
  });

  it('takes the type the instance already carries for the field', async() => {
    const data = await resolveMediaInfo({ animation_url: ANIMATION_URL, animation_media_type: 'html', image_media_type: 'image' });

    expect(data).toEqual([ { src: ANIMATION_URL, mediaType: 'html', transport: 'http' } ]);
    expect(fetchMock.mock.calls).toHaveLength(0);
  });

  it('asks the API for the type when the instance cannot tell', async() => {
    mockMediaTypeResponse({ animation_media_type: 'html', image_media_type: 'image' });

    const data = await resolveMediaInfo({ animation_url: ANIMATION_URL, animation_media_type: null });

    expect(data).toEqual([ { src: ANIMATION_URL, mediaType: 'html', transport: 'http' } ]);
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(MEDIA_TYPE_PATH);
  });

  it('resolves nothing when the API cannot classify the media either', async() => {
    mockMediaTypeResponse({ animation_media_type: null, image_media_type: null });

    expect(await resolveMediaInfo({ animation_url: ANIMATION_URL })).toBeNull();
  });

  it('resolves nothing when the API request fails', async() => {
    mockMediaTypeResponse({ message: 'Not found' }, 404);

    expect(await resolveMediaInfo({ animation_url: ANIMATION_URL })).toBeNull();
  });

  it('resolves nothing when the type is not among the allowed ones', async() => {
    const data = toInstance({ animation_url: `${ ANIMATION_URL }.mp4` });
    const { result } = renderHook(
      () => useNftMediaInfo({ data, addressHash: ADDRESS_HASH, size: 'original', allowedTypes: [ 'image' ], field: 'animation_url', isEnabled: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it.each([
    [ 'animation_url', 'ipfs://animation-cid' ],
    [ 'image_url', 'ipfs://image-cid' ],
  ] as const)('loads an image in %s over IPFS from the metadata entry of that field', async(field, ipfsSrc) => {
    const url = `${ IMAGE_URL }.png`;
    const metadata = { animation_url: 'ipfs://animation-cid', image: 'ipfs://image-cid' };

    const data = await resolveMediaInfo({ [field]: url, metadata }, field);

    expect(data).toEqual([
      { src: ipfsSrc, mediaType: 'image', transport: 'ipfs' },
      { src: url, mediaType: 'image', transport: 'http' },
    ]);
  });

  it('shares one API request between the animation and the image of an instance', async() => {
    mockMediaTypeResponse({ animation_media_type: 'video', image_media_type: 'image' });
    const data = toInstance({ animation_url: ANIMATION_URL, image_url: IMAGE_URL });

    const { result } = renderHook(
      () => ({
        animation: useNftMediaInfo({ data, addressHash: ADDRESS_HASH, size: 'original', field: 'animation_url', isEnabled: true }),
        image: useNftMediaInfo({ data, addressHash: ADDRESS_HASH, size: 'original', field: 'image_url', isEnabled: true }),
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.animation.isSuccess && result.current.image.isSuccess).toBe(true));
    expect(result.current.animation.data).toEqual([ { src: ANIMATION_URL, mediaType: 'video', transport: 'http' } ]);
    expect(result.current.image.data).toEqual([ { src: IMAGE_URL, mediaType: 'image', transport: 'http' } ]);
    expect(fetchMock.mock.calls).toHaveLength(1);
  });

  it('keeps apart instances of different collections that share a token id and a URL', async() => {
    const videoInstance = toInstance({ animation_url: ANIMATION_URL, animation_media_type: 'video' });
    const htmlInstance = toInstance({ animation_url: ANIMATION_URL, animation_media_type: 'html' });

    const { result } = renderHook(
      () => ({
        video: useNftMediaInfo({ data: videoInstance, addressHash: ADDRESS_HASH, size: 'original', field: 'animation_url', isEnabled: true }),
        html: useNftMediaInfo({ data: htmlInstance, addressHash: OTHER_ADDRESS_HASH, size: 'original', field: 'animation_url', isEnabled: true }),
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.video.isSuccess && result.current.html.isSuccess).toBe(true));
    expect(result.current.video.data?.[0].mediaType).toBe('video');
    expect(result.current.html.data?.[0].mediaType).toBe('html');
  });
});
