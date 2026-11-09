import styles from './Benefits.module.css';

export function Benefits() {
  return (
    <div className={styles.benefitsPane}>
      <div className={styles.paneHeaderGroup}>
        <h2>Почему Knife.inc?</h2>
        <p className={styles.paneSubtitle}>Инженерный подход к созданию интернет-магазинов без лишней сложности.</p>
      </div>
      <div className={styles.benefitsStack}>
        <div className={styles.bItem}>
          <span className={styles.bNum}>01</span>
          <div>
            <h3>Молниеносный запуск</h3>
            <p>В отличие от громоздких CMS, вы получаете работающий e-commerce сайт за 60 минут с настроенной базой данных и мультитенантностью.</p>
          </div>
        </div>
        <div className={styles.bItem}>
          <span className={styles.bNum}>02</span>
          <div>
            <h3>ИИ-копирайтинг и SEO</h3>
            <p>Нейросеть мгновенно пишет продающие карточки товаров и оптимизирует мета-теги для поисковых роботов Яндекса и Google.</p>
          </div>
        </div>
        <div className={styles.bItem}>
          <span className={styles.bNum}>03</span>
          <div>
            <h3>Честная экономика</h3>
            <p>Никаких платных подписок и оплат до того, как вы увидите готовый результат. Полная свобода в sandbox-режиме.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
