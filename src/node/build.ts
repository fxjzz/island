import { InlineConfig, build as viteBuild } from 'vite'
import { CLIENT_ENTRY_PATH, SSR_ENTRY_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import { dirname, join } from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (isServer: boolean): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config, isServer),
    build: {
      ssr: isServer, //ssr生成产物
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SSR_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: 'esm',
        },
      },
    },
  })

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true)),
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

export async function renderPage(
  render: (url: string) => string,
  routes: Array<any>,
  root: string,
  clientBundle: RollupOutput
) {
  const chunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)

  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path
      const appHtml = render(routePath)
      const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="${chunk.fileName}"></script>
    </body>
  </html>`.trim()
      const fileName = routePath.endsWith('/') ? `${routePath}index.html` : `${routePath}.html`
      await fs.ensureDir(join(root, 'build', dirname(fileName)))
      await fs.writeFile(join(root, 'build', fileName), html)
    })
  )
}

//构建--核心逻辑。
export async function build(root: string, config: SiteConfig) {
  const [clientBundle, serverBundle] = await bundle(root, config)

  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString())

  await renderPage(render, routes, root, clientBundle)
}
