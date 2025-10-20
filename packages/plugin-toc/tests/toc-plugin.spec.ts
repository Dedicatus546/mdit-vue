import { MarkdownIt } from '@markdown-it-enhancer/core';
import { anchor, ariaHidden } from '@markdown-it-enhancer/plugin-anchor';
import { slugify } from '@mdit-vue-for-enhancer/shared';
import { describe, expect, it } from 'vitest';
import { tocPlugin } from '../src/index.js';

const fixtures = {
  simpleTree: `\
[[toc]]
# h1
## h2
### h3
#### h4
##### h5
###### h6
`,
  complexTree: `\
[[toc]]
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
[[toc]]
###### h6
##### h5
#### h4
### h3
## h2
# h1
`,
};

describe('should render toc with default option (h2, h3)', async () => {
  const md = new MarkdownIt().use(tocPlugin);
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const result = await md.render(source);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('should render toc (h1, h2, h3, h4)', async () => {
  const md = new MarkdownIt().use(tocPlugin, {
    level: [1, 2, 3, 4],
  });
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const result = await md.render(source);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('should render toc with RouterLink', async () => {
  const md = new MarkdownIt().use(tocPlugin, {
    // @ts-expect-error 这里类型似乎不匹配，可以使用驼峰
    linkTag: 'RouterLink',
  });
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const result = await md.render(source);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('should render class name correctly', async () => {
  const md = new MarkdownIt().use(tocPlugin, {
    // remove default container class
    containerClass: '',
    // add custom list / item / link class
    listClass: 'toc-list',
    itemClass: 'toc-item',
    linkClass: 'toc-link',
  });
  await md.isReady();

  Object.entries(fixtures).forEach(([name, source]) => {
    it(name, async () => {
      const result = await md.render(source);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('should include html elements and should escape texts', async () => {
  const md = new MarkdownIt({
    html: true,
  })
    .use(anchor, {
      level: [1, 2, 3, 4, 5, 6],
      slugify,
      permalink: ariaHidden({
        class: 'header-anchor',
        symbol: '#',
        space: true,
        placement: 'before',
      }),
    })
    .use(tocPlugin, { slugify });
  await md.isReady();

  const testCases: [string, { slug: string; title: string; h2: string }][] = [
    // html element should be kept as is
    [
      `\
[[toc]]
## foo <bar />
`,
      {
        slug: 'foo',
        title: 'foo <bar />',
        h2: 'foo <bar />',
      },
    ],
    // inline code should be escaped
    [
      `\
[[toc]]
## foo <bar /> \`<code />\`
`,
      {
        slug: 'foo-code',
        title: 'foo <bar /> &lt;code /&gt;',
        h2: 'foo <bar /> <code>&lt;code /&gt;</code>',
      },
    ],
    // text should be escaped
    [
      `\
[[toc]]
## foo <bar/> "baz"
`,
      {
        slug: 'foo-baz',
        title: 'foo <bar/> &quot;baz&quot;',
        h2: 'foo <bar/> &quot;baz&quot;',
      },
    ],
    // text should be escaped
    [
      `\
[[toc]]
## < test >
`,
      {
        slug: 'test',
        title: '&lt; test &gt;',
        h2: '&lt; test &gt;',
      },
    ],
  ];

  testCases.forEach(([source, expected], i) => {
    it(`case ${i}`, async () => {
      expect(await md.render(source)).toEqual(`\
<nav class="table-of-contents"><ul><li><a href="#${expected.slug}">${expected.title}</a></li></ul></nav>
<h2 id="${expected.slug}" tabindex="-1"><a class="header-anchor" href="#${expected.slug}" aria-hidden="true">#</a> ${expected.h2}</h2>
`);
    });
  });
});

describe('edge cases', () => {
  it('should not terminate the blockquote', async () => {
    const md = new MarkdownIt().use(tocPlugin);
    await md.isReady();

    const source = `\
> foo
    [[toc]]
`;
    expect(await md.render(source)).toEqual(`\
<blockquote>
<p>foo
[[toc]]</p>
</blockquote>
`);
  });
});
