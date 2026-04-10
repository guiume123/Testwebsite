export interface NavItem {
  label: string;
  href: string;
  id: string;
  children?: NavItem[];
  isLogo?: boolean;
}

export interface CategoryCard {
  id: string;
  name: string;
  href: string;
  bgClass: string;
}

export interface Product {
  name: string;
  image: string;
  price: string | null;
  description: string | null;
  main_category: string;
  subcategory: string | null;
  brand: string | null;
  link: string;
}

export interface UspItem {
  iconSvg: string;
  title: string;
  subtitle: string;
}

export interface ContactCard {
  id: string;
  iconSvg: string;
  title: string;
  content: string;
}

export interface HourEntry {
  day: string;
  time: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface FooterNavColumn {
  title: string;
  links: { label: string; href: string }[];
}
