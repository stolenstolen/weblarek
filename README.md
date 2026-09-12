# Проектная работа "Веб-ларек"

## Стек проекта

Стек: HTML, SCSS, TS, Vite

## Структура проекта
- `index.html` — корневая разметка страницы и шаблоны модальных окон
- `src/main.ts` — точка входа и логика приложения
- `src/types/index.ts` — типы данных и интерфейсы
- `src/components/` — классы приложения
- `src/components/base/` — базовые классы
- `src/components/models/` — модели данных
- `src/utils/constants.ts` — константы API и категорий
- `src/utils/data.ts` — mock-данные для проверки
- `src/scss/` — глобальные стили и блоки интерфейса

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Архитектура приложения

- Model — хранение данных и логика состояний
- View — DOM-отображение и шаблоны
- Presenter/logic — связка данных и представления в `main.ts`

Такой подход позволяет разделить ответственность компонентов и облегчает расширение функциональности.

## Базовые классы
### `Component`
Базовый класс для компонентов интерфейса. Хранит контейнер DOM и умеет обновлять состояние через `render()`.

### `Api`
Отвечает за HTTP-запросы на сервер. Поддерживает методы `get` и `post` и обработку ответов.

### `EventEmitter`
Реализует паттерн наблюдателя. Используется для подписки на события и их генерации без жёсткой связи между компонентами.

## Модели данных

### `Products`
Хранит общий каталог товаров и выбранный товар для просмотра.

Поля:
- `items: IProduct[]`
- `selectedProduct: IProduct | null`

Методы:
- `setItems(items: IProduct[]): void`
- `getItems(): IProduct[]`
- `getItemById(id: string): IProduct | undefined`
- `setSelectedProduct(product: IProduct | null): void`
- `getSelectedProduct(): IProduct | null`

### `Basket`
Хранит товары, выбранные пользователем для покупки.

Поля:
- `items: IProduct[]`

Методы:
- `getItems(): IProduct[]`
- `add(item: IProduct): void`
- `remove(id: string): void`
- `clear(): void`
- `getTotal(): number`
- `getCount(): number`
- `has(id: string): boolean`

### `Buyer`
Хранит данные покупателя: способ оплаты, email, телефон и адрес.

Поля:
- `payment: TPayment | null`
- `email: string`
- `phone: string`
- `address: string`

Методы:
- `setField(field: keyof IBuyer, value: string | TPayment | null): void`
- `getData(): IBuyer`
- `clear(): void`
- `validate(): Partial<Record<keyof IBuyer, string>>`

## Основная логика приложения
В `src/main.ts` происходят следующие действия:
- инициализация моделей данных;
- получение каталога товаров через API;
- отображение товаров в галерее;
- открытие модального окна товара;
- добавление и удаление товара из корзины;
- открытие корзины и формы оформления заказа;
- валидация полей формы;
- отправка заказа на сервер.

## Проверка
сборка через Vite:

```bash
npm run build
```


