import { useState, useEffect } from 'react';
import type { StoreConfig, TemplateId } from './types';
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from './templates';
import { StoreEditor } from './components/Editor/StoreEditor';
import { StorePreview } from './components/Preview/StorePreview';
import styles from './BuilderPage.module.css';

const BUILDER_STORAGE_KEY = 'shop_saas_builder_config';

function validateStoreConfig(data: unknown): data is StoreConfig {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.name === 'string' &&
    typeof candidate.accent === 'string' &&
    (candidate.templateId === 'minimal' ||
      candidate.templateId === 'catalog' ||
      candidate.templateId === 'story') &&
    Array.isArray(candidate.blocks) &&
    Array.isArray(candidate.products)
  );
}

function getInitialConfig(): StoreConfig {
  if (typeof window === 'undefined') return TEMPLATES[DEFAULT_TEMPLATE_ID];

  try {
    const raw = localStorage.getItem(BUILDER_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (validateStoreConfig(parsed)) {
        return parsed;
      }
    }
  } catch {
    localStorage.removeItem(BUILDER_STORAGE_KEY);
  }

  return TEMPLATES[DEFAULT_TEMPLATE_ID];
}

export function BuilderPage() {
  const [config, setConfig] = useState<StoreConfig>(getInitialConfig);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Сохранение конфигурации в localStorage при изменениях
  useEffect(() => {
    try {
      localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Игнорируем возможные ошибки квоты хранилища
    }
  }, [config]);

  const handleSelectTemplate = (templateId: TemplateId) => {
    const templateConfig = TEMPLATES[templateId];
    setConfig(templateConfig);
  };

  const handleResetToTemplate = () => {
    const templateConfig = TEMPLATES[config.templateId];
    setConfig(templateConfig);
  };

  return (
    <div className={styles.builderRoot}>
      {/* Переключатель для узких экранов (≤900px, 390px mobile) */}
      <div className={styles.mobileTabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'editor'}
          className={`${styles.mobileTab} ${
            mobileTab === 'editor' ? styles.mobileTabActive : ''
          }`}
          onClick={() => setMobileTab('editor')}
        >
          Настройки витрины
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'preview'}
          className={`${styles.mobileTab} ${
            mobileTab === 'preview' ? styles.mobileTabActive : ''
          }`}
          onClick={() => setMobileTab('preview')}
        >
          Предпросмотр
        </button>
      </div>

      <div className={styles.builderGrid}>
        <div
          className={`${styles.editorPane} ${
            mobileTab !== 'editor' ? styles.hideOnMobile : ''
          }`}
        >
          <StoreEditor
            config={config}
            onChangeConfig={setConfig}
            onSelectTemplate={handleSelectTemplate}
            onResetToTemplate={handleResetToTemplate}
          />
        </div>

        <div
          className={`${styles.previewPane} ${
            mobileTab !== 'preview' ? styles.hideOnMobile : ''
          }`}
        >
          <StorePreview config={config} />
        </div>
      </div>
    </div>
  );
}
