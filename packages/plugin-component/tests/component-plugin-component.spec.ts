import { camelize, capitalize } from '@vue/shared';
import { MarkdownIt } from 'markdown-it-enhancer';
import { describe, expect, it } from 'vitest';
import { TAGS_VUE_RESERVED, componentPlugin } from '../src/index.js';
import { createComponentTestCases } from './create-component-test-cases.js';

const kebabCaseComponentTags = [
  'foo-bar',
  'v-123',
  'div-custom',
  'divleading',
  'span-custom',
  'spanleading',
  ...TAGS_VUE_RESERVED,
];
const camelCaseComponentTags = kebabCaseComponentTags.map(camelize);
const pascalCaseComponentTags = camelCaseComponentTags.map(capitalize);
const componentTags = [
  ...kebabCaseComponentTags,
  ...camelCaseComponentTags,
  ...pascalCaseComponentTags,
];

describe('should render component tags correctly', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  const testCases = createComponentTestCases(componentTags);
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

describe('should not render component tags if `html` option is disabled', async () => {
  const md = new MarkdownIt({ html: false }).use(componentPlugin);
  await md.isReady();
  componentTags.forEach((comp, index) => {
    it(`case ${index}`, async () => {
      const source = `<${comp}>foobar</${comp}>`;
      const expected = `<p>&lt;${comp}&gt;foobar&lt;/${comp}&gt;</p>\n`;
      const rendered = await md.render(source);
      expect(rendered).toBe(expected);
    });
  });
});
