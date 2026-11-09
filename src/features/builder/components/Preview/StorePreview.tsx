import type { CSSProperties } from 'react';
import type { StoreConfig } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderers';
import styles from './StorePreview.module.css';

interface StorePreviewProps {
  config: StoreConfig;
}

export function StorePreview({ config }: StorePreviewProps) {
  const containerStyle = {
    '--store-accent': config.accent,
  } as CSSProperties;

  const enabledBlocks = config.blocks.filter(b => b.enabled);

  return (
    <div className={styles.previewContainer} style={containerStyle}>
      <div className={styles.previewTopBar}>
        <div className={styles.previewBadge}>
          <span>Витрина: {config.name || 'Без названия'}</span>
        </div>
        <div>Живой предпросмотр</div>
      </div>

      <div className={styles.storeCanvas}>
        {enabledBlocks.length > 0 ? (
          enabledBlocks.map(block => (
            <BlockRenderer key={block.id} block={block} config={config} />
          ))
        ) : (
          <div className={styles.emptyState}>
            Все блоки выключены. Включите блоки в редакторе, чтобы наполнить витрину.
          </div>
        )}
      </div>
    </div>
  );
}
