import type { MarkdownItPlugin } from '@markdown-it-enhancer/core';
import grayMatter from 'gray-matter';
import type { FrontmatterPluginOptions } from './types.js';

/**
 * Get markdown frontmatter and excerpt
 *
 * Extract them into env
 */
export const frontmatterPlugin: MarkdownItPlugin<[FrontmatterPluginOptions]> = (
  md,
  { grayMatterOptions, renderExcerpt = true } = {},
): void => {
  const parse = md.parse.bind(md);
  md.parse = async (src, env = {}) => {
    const { data, content, excerpt = '' } = grayMatter(src, grayMatterOptions);

    // extract stripped content
    env.content = content;

    // extract frontmatter
    env.frontmatter = {
      // allow providing default value
      ...env.frontmatter,
      ...data,
    };

    // render and extract excerpt
    env.excerpt =
      renderExcerpt && excerpt
        ? // render the excerpt with original markdown-it render method.
          // here we spread `env` to avoid mutating the original object.
          // using deep clone might be a safer choice.
          await md.render(excerpt, { ...env })
        : // use the raw excerpt directly
          excerpt;

    return parse(content, env);
  };
};
