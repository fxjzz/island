import { UserConfig as UserConfig$1 } from 'vite';

interface UserConfig {
    title?: string;
    description?: string;
    themeConfig?: ThemeConfig;
    vite?: UserConfig$1;
}
interface ThemeConfig {
    nav?: NavItemWithLink[];
    sidebar?: SidebarItem[] | SidebarMulti;
    footer?: Footer;
}
type NavItemWithLink = {
    text?: string;
    link?: string;
};
interface SidebarMulti {
    [path: string]: SidebarItem[];
}
type SidebarItem = {
    text?: string;
    link?: string;
    items?: SidebarItem[];
};
type Footer = {
    copyright?: string;
    message?: string;
};

declare function defineConfig(config: UserConfig): UserConfig;

export { defineConfig };
