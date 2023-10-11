import { InlineConfig, build as viteBuild } from 'vite'
import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SSR_ENTRY_PATH,
} from './constants'
import type { RollupOutput } from 'rollup'
import path, { dirname, join } from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'
import { RenderResult } from 'runtime/ssr-entry'
import { Route } from './plugin-routes'
import { HelmetData } from 'react-helmet-async'

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (isServer: boolean): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config, isServer),
    build: {
      ssr: isServer, //ssr生成产物
      outDir: isServer ? path.join(root, '.temp') : path.join(root, 'build'),
      rollupOptions: {
        input: isServer ? SSR_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: 'esm',
        },
        external: EXTERNALS,
      },
    },
  })

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true)),
    ])
    const publicDir = join(root, 'public')
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT))
    }
    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT))
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

export async function renderPage(
  render: (url: string, helmetContext: object) => RenderResult,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  const chunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)
  return Promise.all(
    [...routes, { path: '/404' }].map(async (route) => {
      const routePath = route.path

      const helmetContext = {
        context: {},
      } as HelmetData
      const { appHtml, islandProps, islandToPathMap } = await render(
        routePath,
        helmetContext.context
      )
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      )
      const islandBundle = await buildIslands(root, islandToPathMap)
      const islandsCode = (islandBundle as RollupOutput).output[0].code
      const { helmet } = helmetContext.context
      const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      ${helmet?.title?.toString() || ''}
      ${helmet?.meta?.toString() || ''}
      ${helmet?.link?.toString() || ''}
      ${helmet?.style?.toString() || ''}
      <meta name="description" content="xxx">
      ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join('\n')}
      <script type="importmap">
      {
        "imports": {
          ${EXTERNALS.map((name) => `"${name}": "/${normalizeVendorFilename(name)}"`).join(',')}
        }
      }
      </script>
      </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module">${islandsCode}</script>
      <script type="module" src="/${chunk?.fileName}"></script>
      <script id="island-props">${JSON.stringify(islandProps)}</script>
    </body>
  </html>`.trim()
      const fileName = routePath.endsWith('/') ? `${routePath}index.html` : `${routePath}.html`
      await fs.ensureDir(join(root, CLIENT_OUTPUT, dirname(fileName)))
      await fs.writeFile(join(root, CLIENT_OUTPUT, fileName), html)
    })
  )
}

//构建--核心逻辑。
export async function build(root: string, config: SiteConfig) {
  const [clientBundle] = await bundle(root, config)

  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString())
  try {
    await renderPage(render, routes, root, clientBundle)
  } catch (e) {
    console.log(e)
  }
}

async function buildIslands(root: string, islandPathToMap: Record<string, string>) {
  // 根据 islandPathToMap 拼接模块代码内容
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(([islandName, islandPath]) => `import { ${islandName} } from '${islandPath}';`)
      .join('')}
window.ISLANDS = { ${Object.keys(islandPathToMap).join(', ')} };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
  `
  const injectId = 'island:inject'
  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic',
    },
    build: {
      // 输出目录
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS,
      },
    },
    plugins: [
      {
        name: 'island:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER)
            return this.resolve(originId, importer, { skipSelf: true })
          }

          if (id === injectId) {
            return id
          }
        },
        load(id) {
          if (id === injectId) {
            return islandsInjectCode
          }
        },
        // 对于 Islands Bundle，我们只需要 JS 即可，其它资源文件可以删除
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name]
            }
          }
        },
      },
    ],
  })
}

const normalizeVendorFilename = (fileName: string) => fileName.replace(/\//g, '_') + '.js'
