import { useState, useEffect, type FormEvent } from 'react';
import type { StoreConfig, TemplateId, Product, Block } from './types';
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from './templates';
import { storeService } from './storeService';
import { StoreEditor } from './components/Editor/StoreEditor';
import { StorePreview } from './components/Preview/StorePreview';
import styles from './BuilderPage.module.css';

// Простая транслитерация кириллицы в латиницу для генерации slug
function transliterate(word: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };

  return word
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BuilderPage() {
  const [config, setConfig] = useState<StoreConfig>(TEMPLATES[DEFAULT_TEMPLATE_ID]);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasStore, setHasStore] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Состояние сохранения
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string>('');

  // Состояние формы создания витрины
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');
  const [newStoreTemplate, setNewStoreTemplate] = useState<TemplateId>('minimal');
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Загрузка магазина из базы данных Neon
  useEffect(() => {
    let isMounted = true;

    storeService
      .getMyStore()
      .then(store => {
        if (!isMounted) return;
        if (store) {
          setHasStore(true);
          setStoreSlug(store.slug);
          setConfig({
            name: store.name,
            accent: store.accentColor || TEMPLATES[store.templateId as TemplateId]?.accent || '#C87A24',
            templateId: (store.templateId as TemplateId) || 'minimal',
            blocks: (Array.isArray(store.blocks) && store.blocks.length > 0
              ? (store.blocks as Block[])
              : TEMPLATES[(store.templateId as TemplateId) || 'minimal'].blocks),
            products: store.products || [],
          });
        } else {
          setHasStore(false);
        }
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('Ошибка загрузки магазина:', err);
        setHasStore(false);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateStore = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newStoreName.trim()) {
      setCreateError('Введите название магазина');
      return;
    }

    const cleanSlug = newStoreSlug.trim().toLowerCase();
    if (!cleanSlug || cleanSlug.length < 3) {
      setCreateError('Адрес витрины (slug) должен содержать от 3 символов');
      return;
    }

    setIsCreating(true);
    try {
      const template = TEMPLATES[newStoreTemplate];
      const createdStore = await storeService.createStore({
        name: newStoreName.trim(),
        slug: cleanSlug,
        accentColor: template.accent,
        templateId: newStoreTemplate,
      });

      // Сохраняем базовые блоки выбранного шаблона
      await storeService.updateStore({
        blocks: template.blocks,
      });

      // Добавляем начальные товары шаблона в БД
      const addedProducts: Product[] = [];
      for (const p of template.products) {
        try {
          const added = await storeService.addProduct({
            name: p.name,
            price: p.price,
            description: p.description,
          });
          addedProducts.push(added);
        } catch {
          // Игнорируем ошибку единичного товара при создании
        }
      }

      setStoreSlug(createdStore.slug);
      setConfig({
        name: createdStore.name,
        accent: template.accent,
        templateId: newStoreTemplate,
        blocks: template.blocks,
        products: addedProducts.length > 0 ? addedProducts : template.products,
      });
      setHasStore(true);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Не удалось создать магазин');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    setSaveError('');

    try {
      await storeService.updateStore({
        name: config.name,
        accentColor: config.accent,
        templateId: config.templateId,
        blocks: config.blocks,
      });

      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async (prod: Omit<Product, 'id'>) => {
    try {
      const created = await storeService.addProduct(prod);
      setConfig(prev => ({
        ...prev,
        products: [created, ...prev.products],
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Не удалось добавить товар');
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      await storeService.deleteProduct(productId);
      setConfig(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== productId),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Не удалось удалить товар');
    }
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    const templateConfig = TEMPLATES[templateId];
    setConfig(prev => ({
      ...prev,
      accent: templateConfig.accent,
      templateId,
      blocks: templateConfig.blocks,
    }));
  };

  const handleResetToTemplate = () => {
    const templateConfig = TEMPLATES[config.templateId];
    setConfig(prev => ({
      ...prev,
      blocks: templateConfig.blocks,
    }));
  };

  // Транслитерация названия в slug при вводе
  const handleNameChange = (val: string) => {
    setNewStoreName(val);
    if (!newStoreSlug || newStoreSlug === transliterate(newStoreName)) {
      setNewStoreSlug(transliterate(val));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <span>Загрузка данных магазина из базы данных Neon…</span>
      </div>
    );
  }

  // Если у владельца ещё нет магазина — показываем экран быстрого старта
  if (!hasStore) {
    return (
      <div className={styles.onboardingCard}>
        <div className={styles.onboardingHeader}>
          <h2 className={styles.onboardingTitle}>Создайте ваш первый магазин</h2>
          <p className={styles.onboardingSubtitle}>
            Задайте название и уникальный адрес витрины. Магазин будет моментально создан в облаке Neon.
          </p>
        </div>

        <form className={styles.onboardingForm} onSubmit={handleCreateStore} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="new-store-name">
              Название магазина
            </label>
            <input
              id="new-store-name"
              type="text"
              className={styles.input}
              placeholder="Например: Свечи и уют"
              value={newStoreName}
              onChange={e => handleNameChange(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="new-store-slug">
              Адрес витрины (slug)
            </label>
            <input
              id="new-store-slug"
              type="text"
              className={styles.input}
              placeholder="svechi-i-uyut"
              value={newStoreSlug}
              onChange={e =>
                setNewStoreSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')
                )
              }
            />
            <span className={styles.slugHint}>
              Публичный адрес магазина: knife.inc/{newStoreSlug || 'адрес'}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Стартовый шаблон витрины</label>
            <div className={styles.templateOptions}>
              {(['minimal', 'catalog', 'story'] as const).map(t => (
                <div
                  key={t}
                  className={`${styles.templateCard} ${
                    newStoreTemplate === t ? styles.templateCardSelected : ''
                  }`}
                  onClick={() => setNewStoreTemplate(t)}
                >
                  {t === 'minimal' ? 'Minimal' : t === 'catalog' ? 'Catalog' : 'Story'}
                </div>
              ))}
            </div>
          </div>

          {createError && (
            <div className={styles.errorBanner} role="alert">
              {createError}
            </div>
          )}

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isCreating}
          >
            {isCreating ? 'Создание магазина в Neon…' : 'Создать магазин и открыть витрину'}
          </button>
        </form>
      </div>
    );
  }

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
            onSave={handleSave}
            isSaving={isSaving}
            saveStatus={saveStatus}
            saveError={saveError}
            storeSlug={storeSlug}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
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
