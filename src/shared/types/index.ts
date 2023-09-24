import { UserConfig as ViteConfiguration } from 'vite'

export interface SiteConfig {
  root: string
  configPath: string
  siteData: UserConfig
}

export interface UserConfig {
  title?: string
  description?: string
  themeConfig?: ThemeConfig
  vite?: ViteConfiguration
}

export interface ThemeConfig {
  nav?: NavItemWithLink[]
  sidebar?: SidebarItem[] | SidebarMulti
  footer?: Footer
}

export type NavItemWithLink = {
  text?: string
  link?: string
}

export interface SidebarMulti {
  [path: string]: SidebarItem[]
}

export type SidebarItem = {
  text?: string
  link?: string
  items?: SidebarItem[]
}

export type Footer = {
  copyright?: string
  message?: string
}
