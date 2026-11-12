import type { StoreConfig, Block, Product, TemplateId } from './types';

/**
 * Переключает видимость блока (enabled: boolean)
 */
export function toggleBlock(config: StoreConfig, blockId: string): StoreConfig {
  return {
    ...config,
    blocks: config.blocks.map(b => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)),
  };
}

/**
 * Перемещает блок в списке блоков выше или ниже
 */
export function moveBlock(
  config: StoreConfig,
  blockId: string,
  direction: 'up' | 'down'
): StoreConfig {
  const index = config.blocks.findIndex(b => b.id === blockId);
  if (index === -1) return config;

  if (direction === 'up' && index === 0) return config;
  if (direction === 'down' && index === config.blocks.length - 1) return config;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  const newBlocks = [...config.blocks];
  const [removed] = newBlocks.splice(index, 1);
  newBlocks.splice(targetIndex, 0, removed);

  return {
    ...config,
    blocks: newBlocks,
  };
}

/**
 * Обновляет свойства конкретного блока
 */
export function updateBlockProps(
  config: StoreConfig,
  blockId: string,
  newProps: Record<string, unknown>
): StoreConfig {
  return {
    ...config,
    blocks: config.blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        props: {
          ...b.props,
          ...newProps,
        },
      } as Block;
    }),
  };
}

/**
 * Добавляет новый товар в магазин
 */
export function addProduct(config: StoreConfig, product: Omit<Product, 'id'>): StoreConfig {
  const newProduct: Product = {
    ...product,
    id: `prod_${Date.now()}`,
  };

  return {
    ...config,
    products: [...config.products, newProduct],
  };
}

/**
 * Удаляет товар по id
 */
export function removeProduct(config: StoreConfig, productId: string): StoreConfig {
  return {
    ...config,
    products: config.products.filter(p => p.id !== productId),
  };
}

/**
 * Обновляет метаданные магазина (название, акцентный цвет, шаблон)
 */
export function updateStoreMeta(
  config: StoreConfig,
  updates: {
    name?: string;
    accent?: string;
    templateId?: TemplateId;
  }
): StoreConfig {
  return {
    ...config,
    ...updates,
  };
}
