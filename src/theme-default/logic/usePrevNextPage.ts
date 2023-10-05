import { usePageData } from '@runtime'
import { useLocation } from 'react-router-dom'
import { SidebarItem } from 'shared/types'

export function usePrevNextPage() {
  const { pathname } = useLocation()
  const { siteData } = usePageData()
  const sidebar = siteData.themeConfig?.sidebar || {}

  //收集路由数据
  const flattenTitles: SidebarItem[] = []
  Object.keys(sidebar).forEach((item) => {
    const groups = sidebar[item] || []
    groups.forEach((group) => {
      group.items.forEach((item) => {
        flattenTitles.push(item)
      })
    })
  })

  const pageIndex = flattenTitles.findIndex((item) => item.link === pathname)
  const prevPage = flattenTitles[pageIndex - 1] || null
  const nextPage = flattenTitles[pageIndex + 1] || null
  return { prevPage, nextPage }
}
