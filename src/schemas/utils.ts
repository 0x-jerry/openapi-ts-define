import tsm from 'ts-morph'
import type { ReferenceManager } from './types'
import type { JSONSchema7 } from 'json-schema'

export function getDocument(type: tsm.Type | tsm.Symbol) {
  if (type instanceof tsm.Symbol) {
    return getSymbolDoc(type)
  }

  return getSymbolDoc(type.getSymbol()) || getSymbolDoc(type.getAliasSymbol())
}

function getSymbolDoc(sy?: tsm.Symbol) {
  return sy?.compilerSymbol.getDocumentationComment(undefined).at(0)?.text
}

export class RefsManager implements ReferenceManager<JSONSchema7> {
  data = new Map<string, JSONSchema7>()

  has(path: string, typeName: string): boolean {
    const p = this.getKey(path, typeName)
    return this.data.has(p)
  }

  get(path: string, typeName: string): JSONSchema7 | undefined {
    const p = this.getKey(path, typeName)
    return this.data.get(p)
  }

  set(path: string, typeName: string, data: JSONSchema7): void {
    const p = this.getKey(path, typeName)

    this.data.set(p, data)
  }

  getKey(path: string, typeName: string): string {
    return `(${path}).${typeName}`
  }
}
