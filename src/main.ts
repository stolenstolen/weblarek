import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Basket } from './components/Basket';
import { Buyer } from './components/Buyer';
import { LarekApi } from './components/LarekApi';
import { Products } from './components/Products';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { GalleryView } from './components/view/GalleryView';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { CardPreview } from './components/view/CardPreview';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const api = new LarekApi(new Api(API_URL));

const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const modalView = new ModalView();
const galleryView = new GalleryView((id) => {
    const product = productsModel.getItem(id);
    if (!product) {
        return;
    }

    productsModel.setSelected(product);
    const previewCard = new CardPreview((productId, action) => {
        if (action !== 'toggle') {
            return;
        }

        const item = productsModel.getItem(productId);
        if (!item) {
            return;
        }

        if (basketModel.hasItem(item.id)) {
            basketModel.removeItem(item);
        } else {
            basketModel.addItem(item);
        }

        const selected = productsModel.getSelected();
        if (selected) {
            modalView.open(previewCard.render({ product: selected, isInBasket: basketModel.hasItem(selected.id) }));
        }
    });

    modalView.open(previewCard.render({ product, isInBasket: basketModel.hasItem(product.id) }));
});

const basketView = new BasketView(
    (id) => {
        const product = productsModel.getItem(id);
        if (product) {
            basketModel.removeItem(product);
            modalView.open(
                basketView.render({
                    items: basketModel.getItems(),
                    total: basketModel.getTotalPrice(),
                }),
            );
        }
    },
    () => {
        const orderForm = new OrderForm((orderData) => {
            buyerModel.setData({
                payment: orderData.payment,
                address: orderData.address ?? '',
            });

            const contactsForm = new ContactsForm((contactData) => {
                buyerModel.setData(contactData);
                const orderDataForServer = {
                    payment: buyerModel.getData().payment ?? 'card',
                    email: buyerModel.getData().email,
                    phone: buyerModel.getData().phone,
                    address: buyerModel.getData().address,
                    items: basketModel.getItems().map((item) => item.id),
                    total: basketModel.getTotalPrice(),
                };

                api.createOrder(orderDataForServer)
                    .then((result) => {
                        const success = cloneTemplate<HTMLDivElement>('#success');
                        const description = ensureElement<HTMLElement>('.order-success__description', success);
                        description.textContent = `Списано ${result.total} синапсов`;
                        basketModel.clear();
                        buyerModel.clear();
                        modalView.open(success);
                    })
                    .catch((error) => {
                        console.error('Ошибка оформления заказа:', error);
                    });
            });

            modalView.open(contactsForm.render({
                email: buyerModel.getData().email,
                phone: buyerModel.getData().phone,
            }));
        });

        modalView.open(orderForm.render({
            payment: buyerModel.getData().payment,
            address: buyerModel.getData().address,
        }));
    },
);

basketButton.addEventListener('click', () => {
    basketButton.setAttribute('aria-expanded', 'true');
    modalView.open(basketView.render({
        items: basketModel.getItems(),
        total: basketModel.getTotalPrice(),
    }));
});

productsModel.on('products:changed', () => {
    galleryView.render(productsModel.getItems());
});

basketModel.on('basket:changed', () => {
    basketCounter.textContent = String(basketModel.getCount());
    if (basketModel.getCount() === 0) {
        basketCounter.textContent = '0';
    }
});

api.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка получения каталога:', error);
    });

const initialProducts: IProduct[] = [];
galleryView.render(initialProducts);

