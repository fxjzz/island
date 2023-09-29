import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

export const rehypePluginPreWrapper = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      console.log(node)

      // <pre><code>...</code></pre>
      // 1. 找到 pre 元素
      // 2. 解析出代码的语言名称
      // 3. 变换 Html AST
      if (
        node.tagName === 'pre' &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        const codeNode = node.children[0]
        const nodeClassName = codeNode.properties.className.toString() || ''
        console.log(nodeClassName)

        const lang = nodeClassName.split('-')[1]
        console.log(lang)

        const clonedNode: Element = {
          type: 'element',
          tagName: 'pre',
          properties: {},
          children: node.children,
          data: {
            isVisited: true,
          },
        }
        //修改
        node.tagName = 'div'
        node.properties = node.properties || {}
        node.properties.className = nodeClassName //目前和原先的dom结构不一样。
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang',
            },
            children: [
              {
                type: 'text',
                value: lang,
              },
            ],
          },
          clonedNode,
        ]
      }
    })
  }
}
