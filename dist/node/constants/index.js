"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSR_ENTRY_PATH = exports.CLIENT_ENTRY_PATH = exports.DEFAULT_TEMPLATE_PATH = exports.PACKAGE_ROOT = void 0;
const path_1 = require("path");
exports.PACKAGE_ROOT = (0, path_1.join)(__dirname, '..', '..', '..');
exports.DEFAULT_TEMPLATE_PATH = (0, path_1.join)(exports.PACKAGE_ROOT, 'template.html');
exports.CLIENT_ENTRY_PATH = (0, path_1.join)(exports.PACKAGE_ROOT, 'src', 'runtime', 'client-entry.tsx');
exports.SSR_ENTRY_PATH = (0, path_1.join)(exports.PACKAGE_ROOT, 'src', 'runtime', 'ssr-entry.tsx');
