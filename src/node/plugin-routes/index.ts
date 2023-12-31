import { Plugin } from 'vite'
import { RouteService } from './RouteService'
import { PageModule } from 'shared/types'

export interface Route {
  path: string
  element: React.ReactElement
  filePath: string
  preload: () => Promise<PageModule>
}

export interface RoutesConfig {
  root: string
  isSSR: boolean
}

const CONVENTIONAL_ROUTE_ID = 'island:routes'

export function pluginRoutes(config: RoutesConfig): Plugin {
  const routeService = new RouteService(config.root)

  return {
    name: 'island:routes',
    async configResolved() {
      // Vite 启动时，对 RouteService 进行初始化
      await routeService.init()
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id
      }
    },
    load(id) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode(config.isSSR || false)
      }
    },
  }
}
