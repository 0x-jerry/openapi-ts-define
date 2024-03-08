import tsm from 'ts-morph'

export function getJsDoc(node: tsm.JSDocableNode) {
  return node
    .getJsDocs()
    .map((item) => item.getDescription())
    .join('\n')
    .trim()
}

export function getDocument(type: tsm.Type | tsm.Symbol) {
  if (type instanceof tsm.Symbol) {
    return getSymbolDoc(type)
  }

  return getSymbolDoc(type.getSymbol()) || getSymbolDoc(type.getAliasSymbol())
}

function getSymbolDoc(sy?: tsm.Symbol) {
  return sy?.compilerSymbol.getDocumentationComment(undefined).at(0)?.text
}
