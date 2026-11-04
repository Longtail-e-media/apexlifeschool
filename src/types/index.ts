export interface NavItem {
  id: string;
  title: string;
  link: string;
  type?: string;
  subLinks?: NavItem[];
}

export interface HeroSlide {
  title?: string;
  src?: string;
  description?: string;
  highlight?: string;
  buttonLink?: string;
  id?: string;
  tag?: string;
  video?: string;
  mediaType?: string;
  items?: HeroSlide[];
}