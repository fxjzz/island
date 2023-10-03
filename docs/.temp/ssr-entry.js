import React, { useState } from "react";
import { useRoutes } from "react-router-dom";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
const Fragment = jsxRuntime.Fragment;
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
function B() {
  return /* @__PURE__ */ jsx("div", {
    children: "bbb"
  });
}
function Counter() {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsxs("p", {
      children: [count, "1"]
    }), /* @__PURE__ */ jsx("button", {
      onClick: () => setCount((count2) => count2 + 1),
      children: "\u70B9\u51FB\u52A01"
    })]
  });
}
function A() {
  return /* @__PURE__ */ jsx("div", {
    children: "aaaa"
  });
}
function Index() {
  return /* @__PURE__ */ jsx("div", {
    children: "index"
  });
}
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    h2: "h2",
    code: "code",
    h3: "h3",
    p: "p",
    div: "div",
    span: "span",
    pre: "pre"
  }, props.components);
  return jsxs(Fragment, {
    children: [jsx(Counter, {}), "\n", jsxs(_components.h1, {
      id: "gfm-1dd",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#gfm-1dd",
        children: "#"
      }), "GFM 1dd"]
    }), "\n", jsxs(_components.h1, {
      id: "gfm-1",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#gfm-1",
        children: "#"
      }), "GFM 1"]
    }), "\n", jsxs(_components.h2, {
      id: "gfm-1-link",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#gfm-1-link",
        children: "#"
      }), "GFM 1 ", jsx(_components.a, {
        href: "https://islandjs.dev",
        children: "link"
      })]
    }), "\n", jsxs(_components.h2, {
      id: "xxxxxxxxautolink",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#xxxxxxxxautolink",
        children: "#"
      }), "xxxxxxxx", jsx(_components.code, {
        children: "Autolink"
      })]
    }), "\n", jsxs(_components.h2, {
      id: "autolink2222",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#autolink2222",
        children: "#"
      }), "Autolink2222"]
    }), "\n", jsxs(_components.h3, {
      id: "autolink3333-3",
      children: [jsx(_components.a, {
        className: "header-anchor",
        href: "#autolink3333-3",
        children: "#"
      }), "Autolink3333 3"]
    }), "\n", jsxs(_components.p, {
      children: ["literals ", jsx(_components.a, {
        href: "http://www.example.com",
        children: "www.example.com"
      }), ", ", jsx(_components.a, {
        href: "https://example.com",
        children: "https://example.com"
      }), ", and ", jsx(_components.a, {
        href: "mailto:contact@example.com",
        children: "contact@example.com"
      }), "."]
    }), "\n", jsxs(_components.div, {
      className: "language-js",
      children: [jsx(_components.span, {
        className: "lang",
        children: "js"
      }), jsx(_components.pre, {
        className: "shiki",
        style: {
          backgroundColor: "#2e3440ff"
        },
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "console"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "log"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "111"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "Counter"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "/>"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          })]
        })
      })]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, Object.assign({}, props, {
    children: jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
const routes = [
  { path: "/B", element: React.createElement(B) },
  { path: "/Counter", element: React.createElement(Counter) },
  { path: "/guide/a", element: React.createElement(A) },
  { path: "/guide/", element: React.createElement(Index) },
  { path: "/", element: React.createElement(MDXContent) }
];
const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
function Layout() {
  useState(0);
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "This is Layout Component1 "
    }), /* @__PURE__ */ jsx(Content, {})]
  });
}
function App() {
  return /* @__PURE__ */ jsx(Layout, {});
}
function render(pagePath) {
  return renderToString(/* @__PURE__ */ jsx(StaticRouter, {
    location: pagePath,
    children: /* @__PURE__ */ jsx(App, {})
  }));
}
export {
  render,
  routes
};
