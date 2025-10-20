import { MarkdownIt } from '@markdown-it-enhancer/core';
import { describe, expect, it } from 'vitest';
import { componentPlugin } from '../src/index.js';
import { createBlockTestCases } from './create-block-test-cases.js';
import { createInlineTestCases } from './create-inline-test-cases.js';

describe('compatibility with other markdown syntax', async () => {
  const md = new MarkdownIt({ html: true }).use(componentPlugin);
  await md.isReady();
  it('should work with autolink', async () => {
    const source = [
      '<https://github.com>',
      '<localhost:5001/foo>',
      '<made-up-scheme://foo,bar>',
      '<foo@bar.example.com>',
      '<foo+special@Bar.baz-bar0.com>',
      '<a+b+c:d>',
    ].join('\n\n');

    const expected =
      [
        '<a href="https://github.com">https://github.com</a>',
        '<a href="localhost:5001/foo">localhost:5001/foo</a>',
        '<a href="made-up-scheme://foo,bar">made-up-scheme://foo,bar</a>',
        '<a href="mailto:foo@bar.example.com">foo@bar.example.com</a>',
        '<a href="mailto:foo+special@Bar.baz-bar0.com">foo+special@Bar.baz-bar0.com</a>',
        '<a href="a+b+c:d">a+b+c:d</a>',
      ]
        .map((a) => `<p>${a}</p>`)
        .join('\n') + '\n';

    const rendered = await md.render(source);
    expect(rendered).toBe(expected);
  });
});

describe('options', () => {
  describe('should allow setting blockTags and inlineTags', async () => {
    const blockTags = ['img', 'slot'];
    const inlineTags = ['Foo', 'foo-bar', 'FooBar', 'fooBar'];
    const md = new MarkdownIt({ html: true }).use(componentPlugin, {
      blockTags,
      inlineTags,
    });
    await md.isReady();
    const testCases = [
      ...createBlockTestCases(blockTags),
      ...createInlineTestCases(inlineTags),
    ];

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

  it('blockTags should have higher priority', async () => {
    const blockTags = ['force-block', 'ForceBlock'];
    const inlineTags = blockTags;
    const md = new MarkdownIt({ html: true }).use(componentPlugin, {
      blockTags,
      inlineTags,
    });
    await md.isReady();
    const testCases = createBlockTestCases(inlineTags);

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
});
