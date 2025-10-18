/**
 * Type declarations for raw file imports
 * Allows importing files with ?raw suffix to get their content as strings
 */

declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.txt?raw' {
  const content: string;
  export default content;
}
