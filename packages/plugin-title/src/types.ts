export {};

declare module 'markdown-it-enhancer' {
  interface MarkdownItEnv {
    /**
     * The title that extracted by `@mdit-vue/plugin-title`
     */
    title?: string;
  }
}
