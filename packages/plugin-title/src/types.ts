export {};

declare module '@markdown-it-enhancer/core' {
  interface MarkdownItEnv {
    /**
     * The title that extracted by `@mdit-vue/plugin-title`
     */
    title?: string;
  }
}
