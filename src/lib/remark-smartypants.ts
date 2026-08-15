import type { Root, Text } from 'mdast';
import { smartypantsu } from 'smartypants';
import { visit } from 'unist-util-visit';

const SKIP_PARENTS = new Set(['code', 'inlineCode', 'definition', 'yaml', 'toml']);

/**
 * Educate quotes, dashes, and ellipses in Markdown prose.
 * Skips fenced/inline code so examples stay literal.
 */
export function remarkSmartypants() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, _index, parent) => {
      if (parent && SKIP_PARENTS.has(parent.type)) return;
      node.value = smartypantsu(node.value, '1');
    });
  };
}
