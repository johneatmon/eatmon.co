declare module 'smartypants' {
  export function smartypants(text: string, attr?: string | number): string;
  export function smartypantsu(text: string, attr?: string | number): string;
  export function smartquotes(text: string): string;
  export function smartdashes(text: string, attr?: string | number): string;
  export function smartellipses(text: string): string;
}
