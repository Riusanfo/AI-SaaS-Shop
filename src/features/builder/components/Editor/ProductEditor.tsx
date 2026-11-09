import { useState, type FormEvent } from 'react';
import type { Product } from '../../types';
import styles from './StoreEditor.module.css';

interface ProductEditorProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onRemoveProduct: (productId: string) => void;
}

export function ProductEditor({
  products,
  onAddProduct,
  onRemoveProduct,
}: ProductEditorProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введите название товара');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Укажите корректную цену');
      return;
    }

    onAddProduct({
      name: name.trim(),
      price: numPrice,
      description: description.trim(),
    });

    setName('');
    setPrice('');
    setDescription('');
    setError('');
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        <span>Товары магазина ({products.length})</span>
      </div>

      <div className={styles.productList}>
        {products.map(product => (
          <div key={product.id} className={styles.productRow}>
            <div className={styles.productInfo}>
              <span className={styles.productRowName}>{product.name}</span>
              <span className={styles.productRowPrice}>
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <button
              type="button"
              className={styles.btnDelete}
              onClick={() => onRemoveProduct(product.id)}
              title="Удалить товар"
              aria-label={`Удалить ${product.name}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <form className={styles.addProductCard} onSubmit={handleAdd}>
        <div className={styles.label}>Добавить новый товар</div>

        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Название товара"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="number"
            className={styles.input}
            placeholder="Цена (₽)"
            value={price}
            onChange={e => {
              setPrice(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            placeholder="Краткое описание товара"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/*
          TODO (ИИ): Здесь позже встанет кнопка «Сгенерировать описание»
          через вызов API языковой модели / Verity AI
        */}

        {error && (
          <span style={{ color: '#D32F2F', fontSize: 12 }}>{error}</span>
        )}

        <button type="submit" className={styles.btnAddProduct}>
          Добавить товар
        </button>
      </form>
    </div>
  );
}
