import { slugify } from '@mdit-vue-for-enhancer/shared';
import type { MarkdownItHeader } from '@mdit-vue-for-enhancer/types';
import { anchor } from 'markdown-it-anchor-for-enhancer';
import type { MarkdownItEnv } from 'markdown-it-enhancer';
import { MarkdownIt } from 'markdown-it-enhancer';
import { describe, expect, it } from 'vitest';
import { headersPlugin } from '../src/index.js';

const fixtures = {
  simpleTree: `\
# h1
## h2
### h3
#### h4
##### h5
###### h6
`,
  complexTree: `\
# s1
## s1-1
### s1-1-1
#### s1-1-1-1
### s1-1-2
### s1-1-3
#### s1-1-3-1
## s1-2
## s1-3
### s1-3-2
#### s1-3-2-1
##### s1-3-2-1-1
##### s1-3-2-1-2
`,
  reversedTree: `\
###### h6
##### h5
#### h4
### h3
## h2
# h1
`,
};

describe('should extract headers with default option (h2, h3)', async () => {
  const md = new MarkdownIt().use(headersPlugin);
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const env: MarkdownItEnv = {};
      await md.render(source, env);
      expect(env.headers).toMatchSnapshot();
    });
  });
});

describe('should extract nothing', async () => {
  const md = new MarkdownIt().use(headersPlugin, {
    level: [],
  });
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const env: MarkdownItEnv = {};
      await md.render(source, env);
      expect(env.headers).toEqual([]);
    });
  });
});

describe('should extract headers (h1, h2, h3, h4)', async () => {
  const md = new MarkdownIt().use(headersPlugin, {
    level: [1, 2, 3, 4],
  });
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const env: MarkdownItEnv = {};
      await md.render(source, env);
      expect(env.headers).toMatchSnapshot();
    });
  });
});

describe('should not include html elements and should not escape texts', async () => {
  const md = new MarkdownIt({
    html: true,
  })
    .use(anchor, { slugify })
    .use(headersPlugin, { slugify });

  await md.isReady();

  const testCases: [string, MarkdownItHeader[]][] = [
    // html element should be ignored
    [
      '## foo <bar />',
      [
        {
          level: 2,
          title: 'foo',
          slug: 'foo',
          link: '#foo',
          children: [],
        },
      ],
    ],
    // inline code should not be escaped
    [
      '## foo <bar/> `<code />`',
      [
        {
          level: 2,
          title: 'foo  <code />',
          slug: 'foo-code',
          link: '#foo-code',
          children: [],
        },
      ],
    ],
    // text should not be escaped
    [
      '## foo <bar/> "baz"',
      [
        {
          level: 2,
          title: 'foo  "baz"',
          slug: 'foo-baz',
          link: '#foo-baz',
          children: [],
        },
      ],
    ],
    // text should not be escaped
    [
      '## < test >',
      [
        {
          level: 2,
          title: '< test >',
          slug: 'test',
          link: '#test',
          children: [],
        },
      ],
    ],
  ];

  testCases.forEach(([source, expected], i) => {
    it(`case ${i}`, async () => {
      const env: MarkdownItEnv = {};
      await md.render(source, env);
      expect(env.headers).toEqual(expected);
    });
  });
});
