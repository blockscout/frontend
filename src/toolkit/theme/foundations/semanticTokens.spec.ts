import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { SEMANTIC_TOKENS_DEFAULT } from './semanticTokensDefault';

async function loadSemanticTokens(heroBannerButton: object | undefined) {
  const envs: Array<[ string, string ]> = heroBannerButton ?
    [ [ 'NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG', JSON.stringify({ button: heroBannerButton }) ] ] :
    [];
  return withEnvs(envs, async() => {
    const loaded = await import('./semanticTokens');
    return loaded.default as typeof SEMANTIC_TOKENS_DEFAULT;
  });
}

describe('semanticTokens', () => {
  it('is the config-free default when no hero banner button is configured', async() => {
    expect(await loadSemanticTokens(undefined)).toEqual(SEMANTIC_TOKENS_DEFAULT);
  });

  it('lets the hero banner button config override only the values it names', async() => {
    const tokens = await loadSemanticTokens({
      _default: { background: [ '#111111', '#222222' ], text_color: [ '#333333' ] },
      _hover: { background: [ '#444444' ] },
    });
    const hero = tokens.colors.button.hero;
    expect(hero.bg.DEFAULT.value).toEqual({ _light: '#111111', _dark: '#222222' });
    expect(hero.fg.DEFAULT.value).toEqual({ _light: '#333333', _dark: '#333333' });
    expect(hero.bg.hover.value).toEqual({ _light: '#444444', _dark: '#444444' });
    expect(hero.bg.selected).toEqual(SEMANTIC_TOKENS_DEFAULT.colors.button.hero.bg.selected);
    expect(hero.fg.hover).toEqual(SEMANTIC_TOKENS_DEFAULT.colors.button.hero.fg.hover);
    expect(tokens.colors.text).toEqual(SEMANTIC_TOKENS_DEFAULT.colors.text);
  });
});
