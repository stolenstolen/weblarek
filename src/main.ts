import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ApiService } from './components/ApiService';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { IProduct, TPayment } from './types';
import { API_URL, CDN_URL, categoryMap } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basket = new Basket();
const buyer = new Buyer();

const gallery = document.querySelector('.gallery') as HTMLElement | null;
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement | null;
const modal = document.querySelector('#modal-container') as HTMLElement | null;
const modalContent = document.querySelector('.modal__content') as HTMLElement | null;
const modalClose = document.querySelector('.modal__close') as HTMLButtonElement | null;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement | null;
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement | null;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement | null;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement | null;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement | null;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement | null;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement | null;

const formatPrice = (price: number | null): string => {
    if (price === null) return 'Недоступно';
    return `${price} синапсов`;
};

const updateBasketCounter = (): void => {
    if (basketCounter) {
        basketCounter.textContent = String(basket.getCount());
    }
};

const openModal = (): void => {
    if (modal) modal.classList.add('modal_active');
};

const closeModal = (): void => {
    if (modal) modal.classList.remove('modal_active');
    if (modalContent) modalContent.innerHTML = '';
};

const renderCatalog = (items: IProduct[]): void => {
    if (!gallery || !cardTemplate) return;

    gallery.innerHTML = '';

    items.forEach((product) => {
        const card = cardTemplate.content.cloneNode(true) as DocumentFragment;
        const item = card.querySelector('.gallery__item') as HTMLButtonElement;
        const category = card.querySelector('.card__category') as HTMLElement;
        const title = card.querySelector('.card__title') as HTMLElement;
        const image = card.querySelector('.card__image') as HTMLImageElement;
        const price = card.querySelector('.card__price') as HTMLElement;

        item.dataset.id = product.id;
        item.disabled = product.price === null;
        item.setAttribute('aria-disabled', String(product.price === null));

        category.className = `card__category ${categoryMap[product.category as keyof typeof categoryMap] ?? 'card__category_other'}`;
        category.textContent = product.category;
        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;
        price.textContent = product.price === null ? 'Недоступно' : `${product.price} синапсов`;

        gallery.appendChild(card);
    });
};

const renderProductModal = (product: IProduct): void => {
    if (!modalContent || !previewTemplate) return;

    const preview = previewTemplate.content.cloneNode(true) as DocumentFragment;
    const card = preview.querySelector('.card') as HTMLElement;
    const image = preview.querySelector('.card__image') as HTMLImageElement;
    const category = preview.querySelector('.card__category') as HTMLElement;
    const title = preview.querySelector('.card__title') as HTMLElement;
    const description = preview.querySelector('.card__text') as HTMLElement;
    const price = preview.querySelector('.card__price') as HTMLElement;
    const button = preview.querySelector('.card__button') as HTMLButtonElement;

    card.setAttribute('data-id', product.id);
    image.src = `${CDN_URL}${product.image}`;
    image.alt = product.title;
    category.className = `card__category ${categoryMap[product.category as keyof typeof categoryMap] ?? 'card__category_other'}`;
    category.textContent = product.category;
    title.textContent = product.title;
    description.textContent = product.description;
    price.textContent = formatPrice(product.price);

    if (product.price === null) {
        button.textContent = 'Недоступно';
        button.disabled = true;
    } else if (basket.has(product.id)) {
        button.textContent = 'Удалить из корзины';
        button.disabled = false;
    } else {
        button.textContent = 'Купить';
        button.disabled = false;
    }

    button.addEventListener('click', () => {
        if (product.price === null) return;

        if (basket.has(product.id)) {
            basket.remove(product.id);
        } else {
            basket.add(product);
        }

        updateBasketCounter();
        renderProductModal(product);
    });

    modalContent.innerHTML = '';
    modalContent.appendChild(preview);
    openModal();
};

const renderBasketModal = (): void => {
    if (!modalContent || !basketTemplate) return;

    const template = basketTemplate.content.cloneNode(true) as DocumentFragment;
    const list = template.querySelector('.basket__list') as HTMLElement;
    const price = template.querySelector('.basket__price') as HTMLElement;
    const button = template.querySelector('.basket__button') as HTMLButtonElement;

    const items = basket.getItems();

    if (items.length === 0) {
        list.innerHTML = '';
        price.textContent = '0 синапсов';
        button.disabled = true;
    } else {
        items.forEach((product, index) => {
            const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement | null;
            if (!itemTemplate) return;

            const itemNode = itemTemplate.content.cloneNode(true) as DocumentFragment;
            const item = itemNode.querySelector('.basket__item') as HTMLElement;
            const itemIndex = itemNode.querySelector('.basket__item-index') as HTMLElement;
            const title = itemNode.querySelector('.card__title') as HTMLElement;
            const productPrice = itemNode.querySelector('.card__price') as HTMLElement;
            const deleteButton = itemNode.querySelector('.basket__item-delete') as HTMLButtonElement;

            itemIndex.textContent = String(index + 1);
            title.textContent = product.title;
            productPrice.textContent = formatPrice(product.price);
            deleteButton.addEventListener('click', () => {
                basket.remove(product.id);
                updateBasketCounter();
                renderBasketModal();
            });

            list.appendChild(itemNode);
        });

        price.textContent = `${basket.getTotal()} синапсов`;
        button.disabled = false;
        button.addEventListener('click', () => {
            renderOrderForm();
        });
    }

    modalContent.innerHTML = '';
    modalContent.appendChild(template);
    openModal();
};

const getPaymentError = (payment: TPayment | null): string | null => {
    if (!payment) return 'Не выбран способ оплаты';
    return null;
};

const validateOrderStep1 = (payment: TPayment | null, address: string): string | null => {
    if (!payment) return 'Не выбран способ оплаты';
    if (!address.trim()) return 'Укажите адрес доставки';
    return null;
};

const renderOrderForm = (): void => {
    if (!modalContent || !orderTemplate) return;

    const template = orderTemplate.content.cloneNode(true) as DocumentFragment;
    const form = template.querySelector('.form') as HTMLFormElement;
    const errorField = form.querySelector('.form__errors') as HTMLElement;
    const nextButton = form.querySelector('.order__button') as HTMLButtonElement;
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const paymentButtons = Array.from(form.querySelectorAll('.button_alt')) as HTMLButtonElement[];

    const setPayment = (payment: TPayment | null) => {
        buyer.setField('payment', payment ?? null);
        paymentButtons.forEach((button) => {
            const active = button.name === payment;
            button.classList.toggle('button_alt-active', active);
            button.classList.toggle('button_alt', !active);
        });
        const error = getPaymentError(payment);
        if (error) {
            errorField.textContent = error;
        }
        updateOrderFormState();
    };

    const updateOrderFormState = () => {
        const payment = buyer.getData().payment;
        const address = addressInput.value.trim();
        const error = validateOrderStep1(payment, address);

        nextButton.disabled = !!error;
        errorField.textContent = error ?? '';
    };

    paymentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setPayment(button.name as TPayment);
        });
    });

    addressInput.addEventListener('input', () => {
        buyer.setField('address', addressInput.value.trim());
        updateOrderFormState();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const payment = buyer.getData().payment;
        const address = addressInput.value.trim();
        const error = validateOrderStep1(payment, address);

        if (error) {
            errorField.textContent = error;
            return;
        }

        buyer.setField('address', address);
        renderContactsForm();
    });

    buyer.setField('address', addressInput.value.trim());
    updateOrderFormState();

    modalContent.innerHTML = '';
    modalContent.appendChild(template);
    openModal();
};

const renderContactsForm = (): void => {
    if (!modalContent || !contactsTemplate) return;

    const template = contactsTemplate.content.cloneNode(true) as DocumentFragment;
    const form = template.querySelector('.form') as HTMLFormElement;
    const errorField = form.querySelector('.form__errors') as HTMLElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;

    const updateState = () => {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const hasErrors = !email || !phone;
        submitButton.disabled = hasErrors;
        errorField.textContent = hasErrors ? 'Укажите email и телефон' : '';
    };

    emailInput.addEventListener('input', () => {
        buyer.setField('email', emailInput.value.trim());
        updateState();
    });

    phoneInput.addEventListener('input', () => {
        buyer.setField('phone', phoneInput.value.trim());
        updateState();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!email || !phone) {
            errorField.textContent = 'Укажите email и телефон';
            return;
        }

        buyer.setField('email', email);
        buyer.setField('phone', phone);

        const orderData = {
            payment: buyer.getData().payment as TPayment,
            email: buyer.getData().email,
            phone: buyer.getData().phone,
            address: buyer.getData().address,
            total: basket.getTotal(),
            items: basket.getItems().map((item) => item.id),
        };

        try {
            const result = await apiService.createOrder(orderData);
            console.log('Успешный заказ:', result);

            renderSuccessModal(orderData.total);
            basket.clear();
            buyer.clear();
            updateBasketCounter();
        } catch (error) {
            errorField.textContent = 'Не удалось оформить заказ';
            console.error('Ошибка оформления заказа:', error);
        }
    });

    modalContent.innerHTML = '';
    modalContent.appendChild(template);
    openModal();
    updateState();
};

const renderSuccessModal = (total: number): void => {
    if (!modalContent || !successTemplate) return;

    const template = successTemplate.content.cloneNode(true) as DocumentFragment;
    const description = template.querySelector('.order-success__description') as HTMLElement;
    const closeButton = template.querySelector('.order-success__close') as HTMLButtonElement;

    description.textContent = `Списано ${total} синапсов`;
    closeButton.addEventListener('click', closeModal);

    modalContent.innerHTML = '';
    modalContent.appendChild(template);
    openModal();
};

if (gallery) {
    gallery.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest('.gallery__item') as HTMLElement | null;

        if (!card) return;

        const product = productsModel.getItemById(card.dataset.id ?? '');
        if (!product) return;

        productsModel.setSelectedProduct(product);
        renderProductModal(product);
    });
}

if (basketButton) {
    basketButton.addEventListener('click', () => {
        renderBasketModal();
    });
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
}

const api = new Api(API_URL);
const apiService = new ApiService(api);

apiService.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        renderCatalog(response.items);
        console.log('Каталог, полученный с сервера:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка получения товаров с сервера:', error);
        productsModel.setItems(apiProducts.items);
        renderCatalog(apiProducts.items);
    });

console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItemById(apiProducts.items[0].id));
productsModel.setSelectedProduct(apiProducts.items[1]);
console.log('Выбранный товар:', productsModel.getSelectedProduct());

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];
basket.add(firstProduct);
basket.add(secondProduct);
basket.add(firstProduct);
console.log('Корзина после добавления:', basket.getItems());
console.log('Общая стоимость корзины:', basket.getTotal());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Есть товар в корзине?', basket.has(firstProduct.id));
basket.remove(firstProduct.id);
console.log('Корзина после удаления:', basket.getItems());
basket.clear();
console.log('Корзина после очистки:', basket.getItems());

console.log('Пустые данные покупателя:', buyer.getData());
console.log('Ошибки до заполнения:', buyer.validate());
buyer.setField('payment', 'card');
buyer.setField('address', 'Москва, ул. Ленина, 10');
buyer.setField('email', 'user@example.com');
buyer.setField('phone', '+79991234567');
console.log('Данные покупателя после заполнения:', buyer.getData());
console.log('Ошибки после заполнения:', buyer.validate());
buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

updateBasketCounter();
