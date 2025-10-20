import type { MarkdownItEnv } from '@markdown-it-enhancer/core';
import { MarkdownIt } from '@markdown-it-enhancer/core';
import { expect, it } from 'vitest';
import { sfcPlugin } from '../src/index.js';

const source = `\
# hello vuepress

{{ msg }}

<docs>
extra hoisted tag
</docs>

<script setup lang="ts">
const foo = 'scriptSetup'
</script>

<script>
export default {
  setup() {
    return {
      msg: 'script'
    }
  }
}
</script>

<style lang="stylus">
.h1
  red
</style>
`;

it('should extract default sfc blocks correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(sfcPlugin);
  await md.isReady();
  const env: MarkdownItEnv = {};

  const rendered = await md.render(source, env);

  expect(rendered).toMatchSnapshot();
  expect(env.sfcBlocks).toMatchSnapshot();
});

it('should extract custom blocks correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(sfcPlugin, {
    customBlocks: ['docs'],
  });
  await md.isReady();
  const env: MarkdownItEnv = {};

  const rendered = await md.render(source, env);

  expect(rendered).toMatchSnapshot();
  expect(env.sfcBlocks).toMatchSnapshot();
});
