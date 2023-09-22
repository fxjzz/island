"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.renderPage = exports.bundle = void 0;
const vite_1 = require("vite");
const constants_1 = require("./constants");
const path_1 = require("path");
const fs = require("fs-extra");
async function bundle(root) {
    const resolveViteConfig = (isServer) => {
        return {
            mode: 'production',
            root,
            build: {
                ssr: isServer,
                outDir: isServer ? '.temp' : 'build',
                rollupOptions: {
                    input: isServer ? constants_1.SSR_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                    output: {
                        format: isServer ? 'cjs' : 'esm',
                    },
                },
            },
        };
    };
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true)),
        ]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    const appHtml = render();
    const chunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry);
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
  </html>`.trim();
    await fs.ensureDir((0, path_1.join)(root, 'build'));
    await fs.writeFile((0, path_1.join)(root, 'build', 'index.html'), html);
    await fs.remove((0, path_1.join)(root, '.temp'));
}
exports.renderPage = renderPage;
//构建--核心逻辑。
async function build(root = process.cwd()) {
    const [clientBundle, serverBundle] = await bundle(root);
    const serverEntryPath = (0, path_1.join)(root, '.temp', 'ssr-entry.js');
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}
exports.build = build;
