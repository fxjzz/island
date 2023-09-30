import { InlineConfig, build as viteBuild } from 'vite'
import { CLIENT_ENTRY_PATH, SSR_ENTRY_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import { join } from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (isServer: boolean): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config),
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

export async function renderPage(render: () => string, root: string, clientBundle: RollupOutput) {
  const appHtml = render()
  const chunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)

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
  await fs.ensureDir(join(root, 'build'))
  await fs.writeFile(join(root, 'build', 'index.html'), html)
  await fs.remove(join(root, '.temp'))
}

//构建--核心逻辑。
export async function build(root: string, config: SiteConfig) {
  const [clientBundle, serverBundle] = await bundle(root, config)

  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  const { render } = await import(pathToFileURL(serverEntryPath).toString())

  await renderPage(render, root, clientBundle)
}
