import { Plugin } from 'vite'

interface RoutesConfig {
  root: string
}

const ROUTE_ID = 'island:routes'

export function pluginRoutes(config: RoutesConfig): Plugin {
  return {
    name: 'island:routes',
    resolveId(id) {
      if (id === ROUTE_ID) {
        return '\0' + ROUTE_ID
      }
    },
    load(id) {
      if (id === '\0' + ROUTE_ID) {
        return `export const routes = []`
      }
    },
  }
}
