import styles from './index.module.scss'
import { NavItemWithLink } from 'shared/types'
import { usePageData } from '@runtime'
import { SwitchAppearance } from '../SwitchAppearance'

export function MenuItem({ item }: { item: NavItemWithLink }) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={styles.link}>
        {item.text}
      </a>
    </div>
  )
}

export function Nav() {
  const { siteData } = usePageData()
  const nav = siteData.themeConfig.nav || []
  return (
    <header fixed="~" pos="t-0 l-0" w="full" bg="white" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        className={`h-14 divider-bottom ${styles.nav}`}
      >
        <div>
          <a
            href="/"
            hover="opacity-60"
            className="w-full h-full text-1rem font-semibold flex items-center"
          >
            Island.js
          </a>
        </div>
        <ul flex="~">
          <li flex="~">
            {nav.map((item) => (
              <MenuItem item={item} key={item.text} />
            ))}
          </li>
          <li before="menu-item-before" flex="~">
            <SwitchAppearance __island />
          </li>
          <li className={styles.socialLinkIcon} before="menu-item-before">
            <a href="/">
              <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
