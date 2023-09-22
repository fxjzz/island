import { cac } from 'cac'
import * as path from 'path'
import { createDevServer } from './dev'
import { build } from './build'

const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    root = root ? path.resolve(root) : path.resolve()
    const server = await createDevServer(root)
    await server.listen()
    server.printUrls()
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
