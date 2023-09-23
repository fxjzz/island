import fs from 'fs-extra'
import { resolve } from 'path'
import { loadConfigFromFile } from 'vite'
import { UserConfig } from '../shared/types'

type RawConfig = UserConfig | Promise<UserConfig> | (() => UserConfig | Promise<UserConfig>)

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js']
    const configPath = supportConfigFiles.map((file) => resolve(root, file)).find(fs.pathExistsSync)
    return configPath
  } catch (e) {
    console.error(`Failed to load user config: ${e}`)
    throw e
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  const configPath = getUserConfigPath(root)
  // loadConfigFromFile
  const result = await loadConfigFromFile({ command, mode }, configPath, root)

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result
    const userConfig = await (typeof rawConfig === 'function' ? rawConfig() : rawConfig)
    return [configPath, userConfig] as const
  } else {
    return [configPath, {} as UserConfig] as const
  }
}
