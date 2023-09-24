import { createServer as createViteDevServer } from 'vite'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'
import { resolveConfig } from './config'
import { pluginConfig } from './plugin-island/config'

export async function createDevServer(root = process.cwd()) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config)],
  })
}
