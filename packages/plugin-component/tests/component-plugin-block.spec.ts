import { MarkdownIt } from 'markdown-it-enhancer';
import { describe, expect, it } from 'vitest';
import { TAGS_BLOCK, componentPlugin } from '../src/index.js';
import { createBlockTestCases } from './create-block-test-cases.js';

describe('should render html block tags correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  const testCases = createBlockTestCases(TAGS_BLOCK);
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

describe('some behaviors of original html block ruler (mainly for coverage purpose)', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  describe('those html blocks whose ending tag is not required to be followed with an empty line', () => {
    it('ending tag in the same line as starting tag', async () => {
      const source = '<pre>foobar</pre>';
      const expected = '<pre>foobar</pre>';
      const rendered = await md.render(source);
      expect(rendered).toBe(expected);
    });

    it('ending tag in different line from starting tag', async () => {
      const source = '<pre>foobar\n</pre>';
      const expected = '<pre>foobar\n</pre>';
      const rendered = await md.render(source);
      expect(rendered).toBe(expected);
    });
  });
});
