# Карточка задачи: Персистентность витрины и товаров в БД (Store & Product API)

## Описание задачи
- **Что сделать**: Добавить в схему Prisma модели `Store` и `Product`, применить миграцию в Neon PostgreSQL, разработать валидационные Zod-схемы и защищённые эндпоинты Express для создания, получения и обновления витрины и каталога товаров с изоляцией по `storeId` и проверкой роли `STORE_OWNER`.
- **Цель**: Обеспечить надёжное сохранение созданной витрины в БД для владельцев магазинов, заложить фундамент мультитенантности и закрыть критерии ТЗ по созданию магазина.

## План реализации
1. Обновить `server/prisma/schema.prisma`: модели `Store` и `Product`, накатить миграцию Prisma (`add_store_and_product`).
2. Создать Zod-схемы валидации в `server/src/schemas/store.ts`.
3. Реализовать маршруты в `server/src/routes/store.ts`: `GET /api/stores/me`, `POST /api/stores`, `PUT /api/stores/me`, `POST /api/stores/me/products`, `DELETE /api/stores/me/products/:productId` под `requireAuth` + `requireRole('STORE_OWNER')`.
4. Зарегистрировать маршруты в `server/src/index.ts`, проверить `npm run lint` и `npm run build`.

## Критерии проверки
- [x] Модели `Store` и `Product` описаны в `schema.prisma` со связями и внешними ключами.
- [x] Миграция `20261109095710_add_store_and_product` успешно создана и применена к базе Neon PostgreSQL.
- [x] Все управляющие маршруты требуют аутентификацию и роль `STORE_OWNER`.
- [x] Запросы к товарам и витрине строго фильтруются по `ownerId` / `storeId` (изоляция мультитенантности).
- [x] `npm run lint` и `npm run build` проходят без ошибок.
