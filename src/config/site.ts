import rawSiteConfig from './site.json';

export type NavLink = {
  label: string;
  to: string;
};

export type NavItem =
  | {
      type: 'link';
      label: string;
      to: string;
    }
  | {
      type: 'dropdown';
      label: string;
      items: NavLink[];
    };

type HeroConfig = {
  title: string;
  subtitle: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  link: string | null;
};

type TechStackItem = {
  name: string;
  category: string;
};

type HomePageConfig = {
  hero: HeroConfig;
  features: FeatureItem[];
  techStack: TechStackItem[];
};

type ColorPaletteConfig = {
  title: string;
  subtitle: string;
  colorLabels: string[];
};

type NpmPackagesConfig = {
  title: string;
  subtitle: string;
};

type PagesConfig = {
  home: HomePageConfig;
  colorPalette: ColorPaletteConfig;
  npmPackages: NpmPackagesConfig;
};

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    tagline: string;
  };
  navigation: {
    main: NavItem[];
  };
  pages: PagesConfig;
  footer: {
    text: string;
  };
}

const siteConfig = rawSiteConfig as SiteConfig;

export default siteConfig;
