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
      .sync(['**/*.{js,jsx,ts,tsx}'], {
        cwd: this.scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.{js,ts}'],
      })
      .sort()
    files.forEach((file) => {
      const fileRelativePath = normalizePath(path.relative(this.scanDir, file))
      console.log(fileRelativePath)

      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath)
      // 2. 文件绝对路径
      this.routeData.push({
        routePath,
        absolutePath: file,
      })
    })
    console.log(this.routeData)
  }

  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '')
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }
}
