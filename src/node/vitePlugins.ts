import pluginReact from '@vitejs/plugin-react'
import { pluginConfig } from './plugin-island/config'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginRoutes } from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { pluginMdx } from './plugin-mdx'
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'
import path from 'path'
import { PACKAGE_ROOT } from './constants'
import babelPluginIsland from './babel-plugin-island'

export async function createVitePlugins(
  config: SiteConfig,
  isSSR: boolean,
  restartServer?: () => Promise<void>
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR ? path.join(PACKAGE_ROOT, 'src', 'runtime') : 'react',
      babel: {
        plugins: [babelPluginIsland],
      },
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root, isSSR }),
    await pluginMdx(),
  ]
}
