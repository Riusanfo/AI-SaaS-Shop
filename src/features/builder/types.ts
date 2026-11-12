export type BlockType = 'header' | 'hero' | 'productGrid' | 'about' | 'footer';

export interface HeaderBlock {
  id: string;
  type: 'header';
  enabled: boolean;
  props: {
    title: string;
    showNav: boolean;
  };
}

export interface HeroBlock {
  id: string;
  type: 'hero';
  enabled: boolean;
  props: {
    heading: string;
    subheading: string;
    ctaText: string;
  };
}

export interface ProductGridBlock {
  id: string;
  type: 'productGrid';
  enabled: boolean;
  props: {
    title: string;
    columns: 2 | 3 | 4;
  };
}

export interface AboutBlock {
  id: string;
  type: 'about';
  enabled: boolean;
  props: {
    title: string;
    text: string;
  };
}

export interface FooterBlock {
  id: string;
  type: 'footer';
  enabled: boolean;
  props: {
    copyright: string;
    contactNote: string;
  };
}

export type Block =
  | HeaderBlock
  | HeroBlock
  | ProductGridBlock
  | AboutBlock
  | FooterBlock;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export type TemplateId = 'minimal' | 'catalog' | 'story';

export interface AccentColorOption {
  label: string;
  value: string;
}

export interface StoreConfig {
  name: string;
  accent: string;
  templateId: TemplateId;
  blocks: Block[];
  products: Product[];
}

export interface ServerStore {
  id: string;
  name: string;
  slug: string;
  accentColor: string;
  templateId: TemplateId;
  blocks: Block[];
  isPublished: boolean;
  products: Product[];
}
