import type {
  MarkdownItEnv,
  MarkdownItPlugin,
} from '@markdown-it-enhancer/core';
import { resolveTitleFromToken } from '@mdit-vue-for-enhancer/shared';

/**
 * Get markdown page title info
 *
 * Extract it into env
 */
export const titlePlugin: MarkdownItPlugin = (md): void => {
  // extract title to env
  const render = md.renderer.render.bind(md.renderer);
  md.renderer.render = async (tokens, options, env: MarkdownItEnv) => {
    const tokenIdx = tokens.findIndex((token) => token.tag === 'h1');
    env.title =
      tokenIdx > -1
        ? resolveTitleFromToken(tokens[tokenIdx + 1], {
            shouldAllowHtml: false,
            shouldEscapeText: false,
          })
        : '';
    return render(tokens, options, env);
  };
};
