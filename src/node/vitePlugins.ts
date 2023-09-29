import pluginReact from '@vitejs/plugin-react'
import { pluginConfig } from './plugin-island/config'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginRoutes } from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { createPluginMdx } from './plugin-mdx'

export function createVitePlugins(config: SiteConfig, restartServer?: () => Promise<void>) {
  return [
    pluginIndexHtml(),
    pluginReact({ jsxRuntime: 'automatic' }),
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root }),
    createPluginMdx(),
  ]
}