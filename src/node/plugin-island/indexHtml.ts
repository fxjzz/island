import { readFile } from 'fs/promises'
import { Plugin } from 'vite'
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants'

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    apply: 'serve',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              //todo
              src: `/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: 'body',
          },
        ],
      }
    },
    configureServer(server) {
      //后置中间件
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8')

          try {
            html = await server.transformIndexHtml(req.url, html)

            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          } catch (e) {
            return next(e)
          }
        })
      }
    },
  }
}
