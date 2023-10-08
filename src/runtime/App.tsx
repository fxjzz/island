import { matchRoutes } from 'react-router-dom'
import { Layout } from '../theme-default'
import { routes } from 'island:routes'
import siteData from 'island:site-data'
import { Route } from 'node/plugin-routes'
import { PageData } from 'shared/types'

export function App() {
  return <Layout />
}

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath)
  //todo

  if (matched) {
    const route = matched[0].route as Route
    const moduleInfo = await route.preload()
    console.log(moduleInfo.frontmatter?.pageType)

    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc,
    }
  } else {
    return {
      pageType: '404',
      siteData,
      pagePath: routePath,
      frontmatter: {
        title: '404',
        description: '页面不存在',
      },
    }
  }
}
