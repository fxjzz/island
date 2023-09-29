import pluginReact from '@vitejs/plugin-react'
import { pluginConfig } from './plugin-island/config'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginRoutes } from './plugin-routes'
import { SiteConfig } from 'shared/types'

export function createVitePlugins(config: SiteConfig, restartServer?: () => Promise<void>) {
  return [
    pluginReact({ jsxRuntime: 'automatic' }),
    pluginConfig(config, restartServer),
    pluginIndexHtml(),
    pluginRoutes({ root: config.root }),
  ]
}
