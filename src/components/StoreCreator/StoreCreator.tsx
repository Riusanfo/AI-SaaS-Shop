import { useState } from 'react';
import styles from './StoreCreator.module.css';

export function StoreCreator() {
  const [storeName, setStoreName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'minimal' | 'neon' | 'warm'>('minimal');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    setIsGenerated(true);
  };

  return (
    <div className={styles.creatorPane}>
      <div className={styles.paneHeaderGroup}>
        <h2>Генерация магазина с ИИ</h2>
        <p className={styles.paneSubtitle}>Опишите вашу идею, и нейросеть создаст уникальный каркас витрины.</p>
      </div>

      {!isGenerated ? (
        <form className={styles.creatorForm} onSubmit={handleGenerate}>
          <div className={styles.formGroup}>
            <label htmlFor="store-name">Название магазина или ключевой товар</label>
            <input
              id="store-name"
              type="text"
              placeholder="Например: Уютные свечи из соевого воска"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Категория каталога</label>
            <input
              id="category"
              type="text"
              placeholder="Например: Дом, декор, подарки"
              value={productCategory}
              onChange={e => setProductCategory(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Выберите стиль витрины</label>
            <div className={styles.templateSelector}>
              <div
                className={`${styles.templateOption} ${selectedTemplate === 'minimal' ? styles.active : ''}`}
                onClick={() => setSelectedTemplate('minimal')}
              >
                <strong>Minimal</strong>
                <span>Строгий монохром</span>
              </div>
              <div
                className={`${styles.templateOption} ${selectedTemplate === 'neon' ? styles.active : ''}`}
                onClick={() => setSelectedTemplate('neon')}
              >
                <strong>Cyber Neon</strong>
                <span>Тёмный неон</span>
              </div>
              <div
                className={`${styles.templateOption} ${selectedTemplate === 'warm' ? styles.active : ''}`}
                onClick={() => setSelectedTemplate('warm')}
              >
                <strong>Warm Craft</strong>
                <span>Тёплые текстуры</span>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Сгенерировать магазин
          </button>
        </form>
      ) : (
        <div className={styles.successPreview}>
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>✨</div>
            <h3>Магазин «{storeName}» готов!</h3>
            <p>Мы создали структуру в стиле <strong>{selectedTemplate}</strong>, сгенерировали описания товаров и подключили корзину.</p>
          </div>
          <div className={styles.successActions}>
            <button className={styles.btnPrimary} onClick={() => alert('Переход в панель управления...')}>
              Открыть админку
            </button>
            <button className={styles.btnSecondary} onClick={() => setIsGenerated(false)}>
              Создать другой
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
