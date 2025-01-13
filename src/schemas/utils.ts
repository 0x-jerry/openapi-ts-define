import type { JSONSchema7 } from 'json-schema'
import tsm from 'ts-morph'
import type { ReferenceManager } from './types'

export function getDocument(type: tsm.Type | tsm.Symbol) {
  if (type instanceof tsm.Symbol) {
    return getSymbolDoc(type)
  }

  return getSymbolDoc(type.getSymbol()) || getSymbolDoc(type.getAliasSymbol())
}

function getSymbolDoc(sy?: tsm.Symbol) {
  return sy?.compilerSymbol.getDocumentationComment(undefined).at(0)?.text
}

export abstract class SimpleRefsManager implements ReferenceManager<JSONSchema7> {
  data = new Map<string, JSONSchema7>()

  has(path: string, typeName: string): boolean {
    return this.data.has(this.getDataKey(path, typeName))
  }

  // todo, maybe do not need this function.
  get(path: string, typeName: string): JSONSchema7 | undefined {
    return this.data.get(this.getDataKey(path, typeName))
  }

  set(path: string, typeName: string, data: JSONSchema7): void {
    this.data.set(this.getDataKey(path, typeName), data)
  }

  abstract getDataKey(path: string, typeName: string): string

  abstract getRefKey(path: string, typeName: string): string
}

export class RefsManager extends SimpleRefsManager {
  getDataKey(path: string, typeName: string): string {
    return this.getRefKey(path, typeName)
  }

  getRefKey(path: string, typeName: string): string {
    return `(${path}).${typeName}`
  }
}
