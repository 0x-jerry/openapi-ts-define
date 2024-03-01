import { Project } from 'ts-morph'
import fg from 'fast-glob'
import path from 'path'
import { url } from 'inspector'
import { Node } from 'ts-morph'
import type { Type } from 'ts-morph'
import type { TypeNode } from 'ts-morph'

export interface OpenapiRouteDefineOption {
  cwd?: string

  tsconfig: string

  routes: ApiRoutesConfig
}

interface ApiRoutesConfig {
  root: string
  /**
   * glob pattern
   */
  files: string[]
}

createGenerator({
  tsconfig: 'tsconfig.json',
  routes: {
    root: path.resolve('example/routes'),
    files: ['**/*.ts'],
  },
})

export async function createGenerator(option: OpenapiRouteDefineOption) {
  const tsProject = new Project({
    tsConfigFilePath: option.tsconfig,
  })

  const files = await fg(option.routes.files, { cwd: option.routes.root })

  for (const file of files) {
    parseApiRouteFile(option.routes, tsProject, file)
  }
}

function convertToUrlPath(relativeFilePath: string) {
  const parsedPath = path.parse(relativeFilePath)
  // todo, parse request params
  const urlSegments = parsedPath.dir.split(path.sep)

  if (parsedPath.name !== 'index') {
    urlSegments.push(parsedPath.name)
  }

  let urlPath = urlSegments.join('/')
  urlPath = urlPath[0] === '/' ? urlPath : '/' + urlPath

  return {
    path: urlPath,
  }
}

function parseApiRouteFile(config: ApiRoutesConfig, project: Project, relativeFilePath: string) {
  const filePath = path.join(config.root, relativeFilePath)

  const urlPath = convertToUrlPath(relativeFilePath)

  const routeSourceFile = project.getSourceFileOrThrow(filePath)

  const methods = ['get', 'post', 'put', 'delete']

  const exportSymbols = routeSourceFile.getExportSymbols()

  for (const exportSymbol of exportSymbols) {
    const method = exportSymbol.getName()

    if (!methods.includes(method)) {
      continue
    }

    const variableDeclaration = exportSymbol.getValueDeclaration()

    if (!Node.isVariableDeclaration(variableDeclaration)) {
      continue
    }

    const initializer = variableDeclaration.getInitializer()

    if (!Node.isCallExpression(initializer)) {
      continue
    }

    const args = initializer.getTypeArguments()
    const [reqArg, respArg] = args.map((item) => item)

    if (!Node.isTypeLiteral(reqArg)) {
      continue
    }

    const members = reqArg.getMembers()

    const query = members.find((n) => Node.isPropertySignature(n) && n.getName() === 'query')
    const body = members.find((n) => Node.isPropertySignature(n) && n.getName() === 'body')

    // parseObjectType(query)
    console.log(!!query, !!body)

    // console.log(reqArg.getMembers().length)

    // parseType()
    // getProperty()

    // console.log(t)
  }

  // const types = methods
  //   .map((method) => {

  //     console.log(type?.getName())

  //     return type ? { method, type } : null
  //   })
  //   .filter(Boolean)

  // for (const type of types) {
  //   console.log(type?.method)
  // }
}

function parseObjectType(type?: TypeNode) {}

function parseType(type?: TypeNode) {
  if (!type) return {}
}
