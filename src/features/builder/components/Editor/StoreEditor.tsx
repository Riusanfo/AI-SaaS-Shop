import { useState } from 'react';
import type { StoreConfig, TemplateId, Block, Product } from '../../types';
import { ACCENT_PRESETS } from '../../templates';
import {
  toggleBlock,
  moveBlock,
  updateBlockProps,
  addProduct,
  removeProduct,
  updateStoreMeta,
} from '../../blockOps';
import { ProductEditor } from './ProductEditor';
import styles from './StoreEditor.module.css';

interface StoreEditorProps {
  config: StoreConfig;
  onChangeConfig: (newConfig: StoreConfig) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onResetToTemplate: () => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  saveError?: string;
  storeSlug?: string;
  onAddProduct?: (product: Omit<Product, 'id'>) => Promise<void> | void;
  onRemoveProduct?: (productId: string) => Promise<void> | void;
}

export function StoreEditor({
  config,
  onChangeConfig,
  onSelectTemplate,
  onResetToTemplate,
  onSave,
  isSaving = false,
  saveStatus = 'idle',
  saveError,
  storeSlug,
  onAddProduct,
  onRemoveProduct,
}: StoreEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    config.blocks[0]?.id || ''
  );

  const selectedBlock = config.blocks.find(b => b.id === selectedBlockId);

  const handleReset = () => {
    if (window.confirm('Сбросить все изменения и восстановить исходный шаблон?')) {
      onResetToTemplate();
    }
  };

  const getBlockName = (block: Block) => {
    switch (block.type) {
      case 'header':
        return 'Шапка витрины (Header)';
      case 'hero':
        return 'Промо-баннер (Hero)';
      case 'productGrid':
        return 'Сетка товаров (Catalog)';
      case 'about':
        return 'О магазине (About)';
      case 'footer':
        return 'Подвал (Footer)';
    }
  };

  return (
    <aside className={styles.editorContainer}>
      {/* 0. Панель облачного сохранения в Neon */}
      <div className={styles.saveBar}>
        <div className={styles.saveStatusGroup}>
          <div className={styles.saveStatusIcon}>
            {saveStatus === 'saved' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : saveStatus === 'saving' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            )}
          </div>
          <span className={styles.saveStatusText}>
            {saveStatus === 'saving'
              ? 'Сохранение в Neon...'
              : saveStatus === 'saved'
                ? 'Сохранено в облаке'
                : saveStatus === 'error'
                  ? saveError || 'Ошибка сохранения'
                  : storeSlug
                    ? `Адрес: /${storeSlug}`
                    : 'Черновик витрины'}
          </span>
        </div>

        {onSave && (
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => void onSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение…' : 'Сохранить витрину'}
          </button>
        )}
      </div>
      {/* 1. Выбор шаблона */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Шаблон витрины</span>
        </div>
        <div className={styles.templateGrid}>
          {(['minimal', 'catalog', 'story'] as const).map(tId => (
            <div
              key={tId}
              className={`${styles.templateCard} ${
                config.templateId === tId ? styles.templateCardActive : ''
              }`}
              onClick={() => onSelectTemplate(tId)}
            >
              <span className={styles.templateName}>
                {tId === 'minimal'
                  ? 'Minimal'
                  : tId === 'catalog'
                    ? 'Catalog'
                    : 'Story'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Основные настройки: Название и акцентный цвет */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Оформление и бренд</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="store-name-input" className={styles.label}>
            Название магазина
          </label>
          <input
            id="store-name-input"
            type="text"
            className={styles.input}
            value={config.name}
            onChange={e =>
              onChangeConfig(updateStoreMeta(config, { name: e.target.value }))
            }
            placeholder="Мой магазин"
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.label}>Акцентный цвет витрины</div>
          <div className={styles.colorSwatches}>
            {ACCENT_PRESETS.map(preset => (
              <button
                key={preset.value}
                type="button"
                className={`${styles.colorSwatch} ${
                  config.accent === preset.value ? styles.colorSwatchActive : ''
                }`}
                style={{ backgroundColor: preset.value }}
                onClick={() =>
                  onChangeConfig(updateStoreMeta(config, { accent: preset.value }))
                }
                title={preset.label}
                aria-label={`Выбрать цвет ${preset.label}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Список блоков: переключение и порядок */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>Блоки витрины ({config.blocks.length})</span>
        </div>

        <div className={styles.blockList}>
          {config.blocks.map((block, index) => (
            <div
              key={block.id}
              className={`${styles.blockRow} ${
                selectedBlockId === block.id ? styles.blockRowSelected : ''
              }`}
            >
              <div
                className={styles.blockRowMain}
                onClick={() => setSelectedBlockId(block.id)}
              >
                <input
                  type="checkbox"
                  checked={block.enabled}
                  onChange={() => onChangeConfig(toggleBlock(config, block.id))}
                  className={styles.blockCheckbox}
                  aria-label={`Включить блок ${getBlockName(block)}`}
                  onClick={e => e.stopPropagation()}
                />
                <span
                  className={`${styles.blockTitle} ${
                    !block.enabled ? styles.blockTitleDisabled : ''
                  }`}
                >
                  {getBlockName(block)}
                </span>
              </div>

              <div className={styles.blockActions}>
                <button
                  type="button"
                  className={styles.btnMove}
                  disabled={index === 0}
                  onClick={() => onChangeConfig(moveBlock(config, block.id, 'up'))}
                  title="Поднять выше"
                  aria-label="Поднять блок выше"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.btnMove}
                  disabled={index === config.blocks.length - 1}
                  onClick={() => onChangeConfig(moveBlock(config, block.id, 'down'))}
                  title="Опустить ниже"
                  aria-label="Опустить блок ниже"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Редактор свойств выбранного блока */}
      {selectedBlock && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Свойства: {getBlockName(selectedBlock)}</span>
          </div>

          <div className={styles.propsBox}>
            {selectedBlock.type === 'header' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Заголовок в шапке</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.title}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          title: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={selectedBlock.props.showNav}
                      onChange={e =>
                        onChangeConfig(
                          updateBlockProps(config, selectedBlock.id, {
                            showNav: e.target.checked,
                          })
                        )
                      }
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    Отображать навигацию в шапке
                  </label>
                </div>
              </>
            )}

            {selectedBlock.type === 'hero' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Главный заголовок</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.heading}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          heading: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Подзаголовок</label>
                  <textarea
                    className={styles.textarea}
                    value={selectedBlock.props.subheading}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          subheading: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Текст на кнопке действия</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.ctaText}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          ctaText: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </>
            )}

            {selectedBlock.type === 'productGrid' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Заголовок секции</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.title}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          title: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Колонок в сетке</label>
                  <select
                    className={styles.select}
                    value={selectedBlock.props.columns}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          columns: Number(e.target.value) as 2 | 3 | 4,
                        })
                      )
                    }
                  >
                    <option value={2}>2 колонки</option>
                    <option value={3}>3 колонки</option>
                    <option value={4}>4 колонки</option>
                  </select>
                </div>
              </>
            )}

            {selectedBlock.type === 'about' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Заголовок блока</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.title}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          title: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Текст о магазине</label>
                  <textarea
                    className={styles.textarea}
                    value={selectedBlock.props.text}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          text: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </>
            )}

            {selectedBlock.type === 'footer' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Копирайт</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.copyright}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          copyright: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Контакты / Примечание</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={selectedBlock.props.contactNote}
                    onChange={e =>
                      onChangeConfig(
                        updateBlockProps(config, selectedBlock.id, {
                          contactNote: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. Управление товарами */}
      <ProductEditor
        products={config.products}
        onAddProduct={onAddProduct || (prod => onChangeConfig(addProduct(config, prod)))}
        onRemoveProduct={onRemoveProduct || (prodId => onChangeConfig(removeProduct(config, prodId)))}
      />

      {/* 6. Сброс к шаблону */}
      <button type="button" className={styles.resetBtn} onClick={handleReset}>
        Сбросить к исходному шаблону
      </button>
    </aside>
  );
}
