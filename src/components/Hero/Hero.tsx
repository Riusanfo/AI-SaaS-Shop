import type { ReactNode } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onStart: () => void;
  onBenefits: () => void;
}

interface DemoProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  tag: string;
  icon: ReactNode;
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: '1',
    title: 'Керамическая ваза Form',
    category: 'Дом & декор',
    price: '2 890 ₽',
    tag: 'Хит',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4" />
        <path d="M10 2v3a2 2 0 0 1-.6 1.4L7 9a6 6 0 0 0-2 4.5V19a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5.5a6 6 0 0 0-2-4.5l-2.4-2.6A2 2 0 0 1 14 5V2" />
      </svg>
    ),
  },
  {
    id: '2',
    title: 'Дрип-пакеты Эфиопия',
    category: 'Кофе & напитки',
    price: '890 ₽',
    tag: 'Новинка',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: '3',
    title: 'Рубашка из умягчённого льна',
    category: 'Гардероб',
    price: '4 490 ₽',
    tag: 'В наличии',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.97 1.68H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h2.17a2 2 0 0 0 1.97-1.68l.58-3.5a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
];

export function Hero({ onStart, onBenefits }: HeroProps) {
  return (
    <div className={styles.heroPane}>
      <div className={styles.heroBadge}>
        <span className={styles.badgeDot}></span>
        ИИ-платформа для интернет-магазинов
      </div>

      <h1 className={styles.heroHeadline}>
        Магазин за 60 минут.<br />
        <span className={styles.heroAccent}>С помощью ИИ.</span>
      </h1>

      <p className={styles.heroSubline}>
        Опишите товар своими словами. Ассистент Verity сгенерирует структуру каталога,
        напишет продающие тексты и подготовит витрину к первым заказам.
      </p>

      <div className={styles.heroActions}>
        <button className={styles.btnPrimary} onClick={onStart}>
          Запустить конструктор
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <button className={styles.btnSecondary} onClick={onBenefits}>
          Узнать преимущества
        </button>
      </div>

      <div className={styles.heroPreviewCard}>
        <div className={styles.previewHeader}>
          <div className={styles.windowDots}>
            <span className={`${styles.dot} ${styles.red}`}></span>
            <span className={`${styles.dot} ${styles.yellow}`}></span>
            <span className={`${styles.dot} ${styles.green}`}></span>
          </div>
          <span className={styles.previewTitle}>demo-store.knife.inc</span>
          <span className={styles.previewLiveBadge}>Online</span>
        </div>

        <div className={styles.previewBody}>
          <div className={styles.mockStoreBar}>
            <div className={styles.mockBrand}>
              <span className={styles.mockLogo}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
              </span>
              <span className={styles.mockName}>Крафтовая Витрина</span>
            </div>
            <div className={styles.mockCartBadge}>Корзина (3)</div>
          </div>

          <div className={styles.mockGrid}>
            {DEMO_PRODUCTS.map((prod) => (
              <div key={prod.id} className={styles.mockProductCard}>
                <div className={styles.productImagePlaceholder}>
                  <div className={styles.productIconWrapper}>
                    {prod.icon}
                  </div>
                  <span className={`${styles.productTag} ${
                    prod.tag === 'Хит' ? styles.hit :
                    prod.tag === 'Новинка' ? styles.new :
                    styles.inStock
                  }`}>{prod.tag}</span>
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productCategory}>{prod.category}</div>
                  <div className={styles.productTitle}>{prod.title}</div>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>{prod.price}</span>
                    <button className={styles.productBuyBtn} type="button">В корзину</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
