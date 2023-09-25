import { cac } from 'cac'
import * as path from 'path'
import { build } from './build'

const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    const { createDevServer } = await import('./dev.js')
    const server = await createDevServer(root, async () => {
      await server.close()
      await createServer()
    })
    await server.listen()
    server.printUrls()
  }

  await createServer()
})

cli.command('build [root]', 'build for production').action(async (root: string) => {
  try {
    //绝对路径
    root = root ? path.resolve(root) : path.resolve()
    await build(root)
  } catch (e) {
    console.log(e)
  }
})

cli.parse()
