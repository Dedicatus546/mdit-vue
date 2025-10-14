import { emoji } from 'markdown-it-emoji-for-enhancer/full';
import type { MarkdownItEnv } from 'markdown-it-enhancer';
import { MarkdownIt } from 'markdown-it-enhancer';
import { describe, expect, it } from 'vitest';
import { titlePlugin } from '../src/index.js';

describe('should extract title from h1 heading', async () => {
  const md = new MarkdownIt().use(emoji).use(titlePlugin);
  await md.isReady();

  const testCases = [
    ['# title from h1 :tada:', 'title from h1 🎉'],
    ['# title from h1 `foobar`', 'title from h1 foobar'],
  ];

  testCases.forEach(([source, expected]) => {
    it(source, async () => {
      const env: MarkdownItEnv = {};
      await md.render(source, env);
      expect(env.title).toEqual(expected);
    });
  });
});

it('should extract empty title', async () => {
  const md = new MarkdownIt().use(emoji).use(titlePlugin);
  await md.isReady();
  const env: MarkdownItEnv = {};
  await md.render('', env);
  expect(env.title).toEqual('');
});
