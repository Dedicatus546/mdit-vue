import { MarkdownIt } from '@markdown-it-enhancer/core';
import { describe, expect, it } from 'vitest';
import {
  TAGS_BLOCK,
  TAGS_INLINE,
  TAGS_VUE_RESERVED,
  componentPlugin,
} from '../src/index.js';
import { createInlineTestCases } from './create-inline-test-cases.js';

const forceNonInlineTags = [...TAGS_VUE_RESERVED, ...TAGS_BLOCK, 'script'];
const inlineTags = TAGS_INLINE.filter(
  (item) => !forceNonInlineTags.includes(item),
);

describe('should render html inline tags correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  const testCases = createInlineTestCases(inlineTags);
  testCases.forEach(({ name, cases }) => {
    describe(name, () => {
      cases.forEach(([source, expected], index) => {
        it(`case ${index}`, async () => {
          const rendered = await md.render(source);
          expect(rendered).toBe(expected);
        });
      });
    });
  });
});

it('should render invalid html inline tags correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  const source = ['<1 />', '<中文 />', '<@foo />'].join('\n\n');
  const expected =
    ['&lt;1 /&gt;', '&lt;中文 /&gt;', '&lt;@foo /&gt;']
      .map((item) => `<p>${item}</p>`)
      .join('\n') + '\n';

  const rendered = await md.render(source);
  expect(rendered).toBe(expected);
});
