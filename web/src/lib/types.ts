/** Shared Strapi shapes used across content query modules. */

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface LinkGroup {
  label: string;
  links: LinkItem[];
}

export interface ContactBlock {
  email?: string | null;
  phone?: string | null;
  office?: string | null;
  hours?: string | null;
}
