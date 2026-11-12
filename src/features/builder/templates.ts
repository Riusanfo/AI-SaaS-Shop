import type { StoreConfig, TemplateId, AccentColorOption } from './types';

export const ACCENT_PRESETS: AccentColorOption[] = [
  { label: 'Янтарный мёд', value: '#C87A24' },
  { label: 'Лесной шалфей', value: '#2D6A4F' },
  { label: 'Глубокий кобальт', value: '#1D4ED8' },
  { label: 'Тёплый аметист', value: '#7C3AED' },
  { label: 'Терракота', value: '#B91C1C' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Керамическая ваза ручной работы',
    price: 2400,
    description: 'Минималистичная форма с матовой текстурой для интерьера.',
  },
  {
    id: 'prod_2',
    name: 'Льняная салфетка с вышивкой',
    price: 750,
    description: 'Натуральный умягчённый лён плотного плетения.',
  },
  {
    id: 'prod_3',
    name: 'Ароматическая свеча из воска',
    price: 1350,
    description: 'Ноты кедра, сандала и мускатного ореха. Время горения 40 часов.',
  },
];

export const TEMPLATES: Record<TemplateId, StoreConfig> = {
  minimal: {
    name: 'Студия предметов',
    accent: '#C87A24',
    templateId: 'minimal',
    blocks: [
      {
        id: 'blk_header',
        type: 'header',
        enabled: true,
        props: {
          title: 'Студия предметов',
          showNav: true,
        },
      },
      {
        id: 'blk_hero',
        type: 'hero',
        enabled: true,
        props: {
          heading: 'Простые вещи со смыслом',
          subheading: 'Коллекция лаконичных предметов для дома, работы и спокойного ритма.',
          ctaText: 'Смотреть каталог',
        },
      },
      {
        id: 'blk_grid',
        type: 'productGrid',
        enabled: true,
        props: {
          title: 'Новые поступления',
          columns: 3,
        },
      },
      {
        id: 'blk_about',
        type: 'about',
        enabled: false,
        props: {
          title: 'О мастерской',
          text: 'Мы создаём небольшие тиражи предметов повседневного обихода, уделяя внимание материалам и деталям.',
        },
      },
      {
        id: 'blk_footer',
        type: 'footer',
        enabled: true,
        props: {
          copyright: '© 2026 Студия предметов. Все права защищены.',
          contactNote: 'Доставка по всей стране • Связаться: hello@store.local',
        },
      },
    ],
    products: DEFAULT_PRODUCTS,
  },

  catalog: {
    name: 'Каталог товаров',
    accent: '#1D4ED8',
    templateId: 'catalog',
    blocks: [
      {
        id: 'blk_header',
        type: 'header',
        enabled: true,
        props: {
          title: 'Каталог товаров',
          showNav: false,
        },
      },
      {
        id: 'blk_grid',
        type: 'productGrid',
        enabled: true,
        props: {
          title: 'Все товары магазина',
          columns: 3,
        },
      },
      {
        id: 'blk_hero',
        type: 'hero',
        enabled: false,
        props: {
          heading: 'Широкий ассортимент',
          subheading: 'Быстрый заказ без лишних шагов.',
          ctaText: 'К покупкам',
        },
      },
      {
        id: 'blk_about',
        type: 'about',
        enabled: false,
        props: {
          title: 'Информация для покупателей',
          text: 'Гарантия качества на каждое изделие и простая процедура возврата.',
        },
      },
      {
        id: 'blk_footer',
        type: 'footer',
        enabled: true,
        props: {
          copyright: '© 2026 Каталог товаров.',
          contactNote: 'Поддержка клиентов ежедневно с 9:00 до 21:00',
        },
      },
    ],
    products: DEFAULT_PRODUCTS,
  },

  story: {
    name: 'Авторская мастерская',
    accent: '#2D6A4F',
    templateId: 'story',
    blocks: [
      {
        id: 'blk_header',
        type: 'header',
        enabled: true,
        props: {
          title: 'Авторская мастерская',
          showNav: true,
        },
      },
      {
        id: 'blk_hero',
        type: 'hero',
        enabled: true,
        props: {
          heading: 'Истории, воплощённые в материале',
          subheading: 'Каждый предмет создаётся вручную с вниманием к текстуре и природе сырья.',
          ctaText: 'Познакомиться с коллекцией',
        },
      },
      {
        id: 'blk_about',
        type: 'about',
        enabled: true,
        props: {
          title: 'Наша философия',
          text: 'Мы верим, что окружение формирует наше состояние. Поэтому мы отбираем только натуральное сырьё и бережно обрабатываем каждый шов и изгиб.',
        },
      },
      {
        id: 'blk_grid',
        type: 'productGrid',
        enabled: true,
        props: {
          title: 'Избранные работы',
          columns: 2,
        },
      },
      {
        id: 'blk_footer',
        type: 'footer',
        enabled: true,
        props: {
          copyright: '© 2026 Авторская мастерская.',
          contactNote: 'Ручная работа • Сделано с теплотой',
        },
      },
    ],
    products: DEFAULT_PRODUCTS,
  },
};

export const DEFAULT_TEMPLATE_ID: TemplateId = 'minimal';
