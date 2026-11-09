import type {
  Block,
  StoreConfig,
  HeaderBlock,
  HeroBlock,
  ProductGridBlock,
  AboutBlock,
  FooterBlock,
} from '../../types';
import styles from '../Preview/StorePreview.module.css';

export function HeaderRenderer({
  block,
  storeName,
}: {
  block: HeaderBlock;
  storeName: string;
}) {
  return (
    <header className={styles.blockHeader}>
      <div className={styles.headerTitle}>{block.props.title || storeName}</div>
      {block.props.showNav && (
        <nav className={styles.headerNav}>
          <span className={styles.headerNavLink}>Каталог</span>
          <span className={styles.headerNavLink}>О нас</span>
          <span className={styles.headerNavLink}>Контакты</span>
        </nav>
      )}
    </header>
  );
}

export function HeroRenderer({ block }: { block: HeroBlock }) {
  return (
    <section className={styles.blockHero}>
      <h1 className={styles.heroHeading}>{block.props.heading}</h1>
      <p className={styles.heroSubheading}>{block.props.subheading}</p>
      {block.props.ctaText && (
        <button type="button" className={styles.heroCta}>
          {block.props.ctaText}
        </button>
      )}
    </section>
  );
}

export function ProductGridRenderer({
  block,
  products,
}: {
  block: ProductGridBlock;
  products: StoreConfig['products'];
}) {
  const columnClass =
    block.props.columns === 2
      ? styles.gridCols2
      : block.props.columns === 4
        ? styles.gridCols4
        : styles.gridCols3;

  return (
    <section className={styles.blockProductGrid}>
      <h2 className={styles.sectionTitle}>{block.props.title}</h2>
      <div className={`${styles.grid} ${columnClass}`}>
        {products.map(prod => (
          <div key={prod.id} className={styles.productCard}>
            <div className={styles.productCardHeader}>
              <span className={styles.productName}>{prod.name}</span>
              <span className={styles.productPrice}>{prod.price.toLocaleString('ru-RU')} ₽</span>
            </div>
            <p className={styles.productDesc}>{prod.description}</p>
            <button type="button" className={styles.productAction}>
              В корзину
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutRenderer({ block }: { block: AboutBlock }) {
  return (
    <section className={styles.blockAbout}>
      <h2 className={styles.sectionTitle}>{block.props.title}</h2>
      <p className={styles.aboutText}>{block.props.text}</p>
    </section>
  );
}

export function FooterRenderer({ block }: { block: FooterBlock }) {
  return (
    <footer className={styles.blockFooter}>
      <div className={styles.footerCopyright}>{block.props.copyright}</div>
      {block.props.contactNote && (
        <div className={styles.footerNote}>{block.props.contactNote}</div>
      )}
    </footer>
  );
}

export function BlockRenderer({
  block,
  config,
}: {
  block: Block;
  config: StoreConfig;
}) {
  if (!block.enabled) return null;

  switch (block.type) {
    case 'header':
      return <HeaderRenderer block={block} storeName={config.name} />;
    case 'hero':
      return <HeroRenderer block={block} />;
    case 'productGrid':
      return <ProductGridRenderer block={block} products={config.products} />;
    case 'about':
      return <AboutRenderer block={block} />;
    case 'footer':
      return <FooterRenderer block={block} />;
  }
}
