import { createServer as createViteDevServer } from 'vite'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { createVitePlugins } from './vitePlugins'

export async function createDevServer(root: string, restartServer: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createViteDevServer({
    plugins: await createVitePlugins(config, false, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  })
}
