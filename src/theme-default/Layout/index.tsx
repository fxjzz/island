import { Content, usePageData } from '../../runtime'
import 'uno.css'
import '../styles/base.css'
import '../styles/vars.css'

export function Layout() {
  const pageData = usePageData()
  // 获取 pageType
  const { pageType } = pageData
  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return (
        <div>
          <Content />
        </div>
      )
    } else if (pageType === 'doc') {
      return (
        <div>
          <Content />
        </div>
      )
    } else {
      return <div>404 页面</div>
    }
  }
  return <div>{getContent()}</div>
}
