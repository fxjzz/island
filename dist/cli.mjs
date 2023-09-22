var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "island-ssg",
      version: "0.0.1",
      description: "",
      main: "index.js",
      type: "module",
      scripts: {
        start: "tsup --watch",
        build: "tsup",
        test: 'echo "Error: no test specified" && exit 1'
      },
      bin: {
        island: "./bin/index.js"
      },
      keywords: [],
      author: "fxjzz",
      license: "ISC",
      devDependencies: {
        "@types/fs-extra": "^11.0.2",
        "@types/node": "^20.6.3",
        rollup: "^3.29.2",
        tsup: "^7.2.0",
        typescript: "^5.2.2"
      },
      dependencies: {
        "@vitejs/plugin-react": "^4.0.4",
        cac: "^6.7.14",
        "fs-extra": "^11.1.1",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        vite: "^4.4.9"
      }
    };
  }
});

// node_modules/.pnpm/tsup@7.2.0_typescript@5.2.2/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/cli.ts
import { cac } from "cac";
import * as path2 from "path";

// src/node/dev.ts
import { createServer as createViteDevServer } from "vite";

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SSR_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

// src/node/plugin-island/indexHtml.ts
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              //todo
              src: `/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(req.url, html);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";
async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}

// src/node/build.ts
import { build as viteBuild } from "vite";
import { join as join2 } from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";
async function bundle(root) {
  const resolveViteConfig = (isServer) => {
    return {
      mode: "production",
      root,
      build: {
        ssr: isServer,
        //ssr生成产物
        outDir: isServer ? ".temp" : "build",
        rollupOptions: {
          input: isServer ? SSR_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: "esm"
          }
        }
      }
    };
  };
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
}
async function renderPage(render, root, clientBundle) {
  const appHtml = render();
  const chunk = clientBundle.output.find((chunk2) => chunk2.type === "chunk" && chunk2.isEntry);
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
  await fs.ensureDir(join2(root, "build"));
  await fs.writeFile(join2(root, "build", "index.html"), html);
  await fs.remove(join2(root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = join2(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
var version = require_package().version;
var cli = cac("island").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  root = root ? path2.resolve(root) : path2.resolve();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = root ? path2.resolve(root) : path2.resolve();
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
