import tsm from 'ts-morph'

export function getJsDoc(node: tsm.JSDocableNode) {
  return node.getJsDocs().map(item => item.getDescription()).join('\n').trim()
}
