import fg from 'fast-glob'
import path from 'path'
import { normalizePath } from 'vite'

export class RouteService {
  private scanDir: string
  private routeData: Array<any> = []

  constructor(scanDir) {
    this.scanDir = scanDir
  }

  async init() {
    const files = fg
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.{js,ts}'],
      })
      .sort()
    files.forEach((file) => {
      const fileRelativePath = normalizePath(path.relative(this.scanDir, file))
      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath)
      // 2. 文件绝对路径
      this.routeData.push({
        routePath,
        absolutePath: file,
      })
    })
  }

  generateRoutesCode(ssr = false) {
    return `
  import React from 'react';
  ${ssr ? '' : 'import loadable from "@loadable/component";'}
  ${this.routeData
    .map((route, index) => {
      return ssr
        ? `import Route${index} from "${route.absolutePath}";`
        : `const Route${index} = loadable(() => import('${route.absolutePath}'));`
    })
    .join('\n')}
  export const routes = [
  ${this.routeData
    .map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}),preload:()=>import('${route.absolutePath}') }`
    })
    .join(',\n')}
  ];
  `
  }
  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '')
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }
}
