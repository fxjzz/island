"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/node/config.ts
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _path = require('path');
var _vite = require('vite');
function getUserConfigPath(root) {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    const configPath = supportConfigFiles.map((file) => _path.resolve.call(void 0, root, file)).find(_fsextra2.default.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
}
async function resolveConfig(root, command, mode) {
  const configPath = getUserConfigPath(root);
  const result = await _vite.loadConfigFromFile.call(void 0, { command, mode }, configPath, root);
  if (result) {
    const { config: rawConfig = {} } = result;
    const userConfig = await (typeof rawConfig === "function" ? rawConfig() : rawConfig);
    return [configPath, userConfig];
  } else {
    return [configPath, {}];
  }
}
function defineConfig(config) {
  return config;
}





exports.__commonJS = __commonJS; exports.resolveConfig = resolveConfig; exports.defineConfig = defineConfig;
