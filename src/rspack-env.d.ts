/// <reference types="@rspack/core" />

declare module '*.css' {
  const content: string;
  export default content;
}
