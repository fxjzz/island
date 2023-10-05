import { Plugin, normalizePath } from 'vite'
import { SiteConfig } from 'shared/types'
import { join, relative } from 'path'
import { PACKAGE_ROOT } from 'node/constants'
import sirv from 'sirv'

const SITE_DATA_ID = 'island:site-data'

export function pluginConfig(config: SiteConfig, restartServer?: () => Promise<void>): Plugin {
  return {
    name: 'island:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [normalizePath(config.configPath)]
      const include = (id: string) => customWatchedFiles.some((file) => id.includes(file))

      if (include(ctx.file)) {
        console.log(`\n${relative(config.root, ctx.file)} changed, restarting server...`)
        // 重启 Dev Server
        try {
          await restartServer()
        } catch (error) {
          console.log(error)
        }
      }
    },
    config() {
      return {
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts'),
          },
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly',
          },
        },
      }
    },
    configureServer(server) {
      const publicDir = join(config.root, 'public')

      server.middlewares.use(sirv(publicDir))
    },
  }
}
