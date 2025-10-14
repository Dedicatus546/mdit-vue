import {
  slugify as defaultSlugify,
  resolveHeadersFromTokens,
} from '@mdit-vue-for-enhancer/shared';
import type { MarkdownItEnv, MarkdownItPlugin } from 'markdown-it-enhancer';
import type { HeadersPluginOptions } from './types.js';

/**
 * Get markdown headers info
 *
 * Extract them into env
 */
export const headersPlugin: MarkdownItPlugin<
  [options?: HeadersPluginOptions]
> = (
  md,
  {
    level = [2, 3],
    shouldAllowNested = false,
    slugify = defaultSlugify,
    format,
  } = {},
): void => {
  // extract headers to env
  const render = md.renderer.render.bind(md.renderer);
  md.renderer.render = async (tokens, options, env: MarkdownItEnv) => {
    env.headers = resolveHeadersFromTokens(tokens, {
      level,
      shouldAllowHtml: false,
      shouldAllowNested,
      shouldEscapeText: false,
      slugify,
      format,
    });
    return render(tokens, options, env);
  };
};
