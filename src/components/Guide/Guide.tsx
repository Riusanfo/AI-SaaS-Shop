import styles from './Guide.module.css';

export function Guide() {
  return (
    <div className={styles.guidePane}>
      <div className={styles.paneHeaderGroup}>
        <h2>Инструкция для команды</h2>
        <p className={styles.paneSubtitle}>Как устроена работа с платформой и код-ревью.</p>
      </div>
      <div className={styles.guideList}>
        <div className={styles.guideStep}>
          <strong>01.</strong> Используйте карточки задач из директории <code>AI/tasks/</code> для каждой новой фичи.
        </div>
        <div className={styles.guideStep}>
          <strong>02.</strong> Соблюдайте изоляцию данных по <code>storeId</code> на всех сервереных эндпоинтах.
        </div>
        <div className={styles.guideStep}>
          <strong>03.</strong> Проверяйте входные данные через общие Zod-схемы в папке <code>shared/</code>.
        </div>
        <div className={styles.guideStep}>
          <strong>04.</strong> Перед коммитом всегда запускайте скрипт проверки <code>scripts/validate.sh</code>.
        </div>
      </div>
    </div>
  );
}
