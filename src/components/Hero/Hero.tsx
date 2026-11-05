import styles from './Hero.module.css';

interface HeroProps {
  onStart: () => void;
  onBenefits: () => void;
}

export function Hero({ onStart, onBenefits }: HeroProps) {
  return (
    <div className={styles.heroPane}>
      <div className={styles.heroBadge}>
        <span className={styles.badgeDot}></span>
        ИИ-платформа нового поколения
      </div>
      <h1 className={styles.heroHeadline}>
        Создайте интернет-магазин за 60 минут с помощью ИИ
      </h1>
      <p className={styles.heroSubline}>
        Забудьте про сложную вёрстку, рутинный дизайн и ручное заполнение SEO-тегов. Наш ассистент Verity сделает всю тяжёлую работу за вас.
      </p>
      <div className={styles.heroActions}>
        <button className={styles.btnPrimary} onClick={onStart}>
          Запустить конструктор
        </button>
        <button className={styles.btnSecondary} onClick={onBenefits}>
          Узнать преимущества
        </button>
      </div>

      <div className={styles.heroPreviewCard}>
        <div className={styles.previewHeader}>
          <span className={`${styles.dot} ${styles.red}`}></span>
          <span className={`${styles.dot} ${styles.yellow}`}></span>
          <span className={`${styles.dot} ${styles.green}`}></span>
          <span className={styles.previewTitle}>knife-inc-preview.ai/store</span>
        </div>
        <div className={styles.previewBody}>
          <div className={styles.previewMockStore}>
            <div className={styles.mockNav}>Knife.store</div>
            <div className={styles.mockHeroText}>Ароматические свечи ручной работы</div>
            <div className={styles.mockGrid}>
              <div className={styles.mockItem}></div>
              <div className={styles.mockItem}></div>
              <div className={styles.mockItem}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
