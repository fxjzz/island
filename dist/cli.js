"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/node/cli.ts
var _cac = require('cac');
var _path = require('path'); var path = _interopRequireWildcard(_path);

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin-island/indexHtml.ts
var _promises = require('fs/promises');

// src/node/constants/index.ts

var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_TEMPLATE_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SSR_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

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
          let html = await _promises.readFile.call(void 0, DEFAULT_TEMPLATE_PATH, "utf-8");
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
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root = process.cwd()) {
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, )]
  });
}

// src/node/build.ts


var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _url = require('url');
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
            format: isServer ? "cjs" : "esm"
          }
        }
      }
    };
  };
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      _vite.build.call(void 0, resolveViteConfig(false)),
      _vite.build.call(void 0, resolveViteConfig(true))
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
  await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build"));
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build", "index.html"), html);
  await _fsextra2.default.remove(_path.join.call(void 0, root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath).toString())));
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
var version = require_package().version;
var cli = _cac.cac.call(void 0, "island").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  root = root ? path.resolve(root) : path.resolve();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = root ? path.resolve(root) : path.resolve();
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
