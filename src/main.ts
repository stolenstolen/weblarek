import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/Basket';
import { Buyer } from './components/Buyer';
import { LarekApi } from './components/LarekApi';
import { Products } from './components/Products';
import { IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';
import { GalleryView } from './components/view/GalleryView';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { CardCatalog } from './components/view/CardCatalog';
import { CardBasket } from './components/view/CardBasket';
import { CardPreview } from './components/view/CardPreview';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';
import { HeaderView } from './components/view/HeaderView';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));

const modalView = new ModalView();
const headerView = new HeaderView(() => events.emit('basket:open'));
headerView.render();
const successView = new SuccessView(() => modalView.close());
const previewCard = new CardPreview(() => events.emit('preview-toggle'));

const handleCatalogSelection = (id: string): void => {
    const product = productsModel.getItem(id);
    if (!product) {
        return;
    }

    productsModel.setSelected(product);
};

const galleryView = new GalleryView();

const createCatalogCards = (): HTMLElement[] => productsModel.getItems().map((product) => {
    const card = new CardCatalog(() => events.emit('catalog:select', { id: product.id }));
    return card.render(product);
});

events.on<{ id: string }>('catalog:select', ({ id }) => handleCatalogSelection(id));

productsModel.on<{ product: IProduct | null }>('products:selected', ({ product }) => {
    if (!product) {
        return;
    }

    modalView.open(previewCard.render({
        product,
        isInBasket: basketModel.hasItem(product.id),
    }));
});

events.on('preview-toggle', () => {
    const product = productsModel.getSelected();
    if (!product) {
        return;
    }

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }

    modalView.close();
});

const handleBuyerFieldChange = (field: string, value: string): void => {
    if (field === 'payment') {
        buyerModel.setPayment(value as TPayment);
    } else if (field === 'address') {
        buyerModel.setAddress(value);
    } else if (field === 'email') {
        buyerModel.setEmail(value);
    } else if (field === 'phone') {
        buyerModel.setPhone(value);
    }
};

const contactsForm = new ContactsForm(() => {
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
            successView.setTotal(result.total);
            basketModel.clear();
            buyerModel.clear();
            modalView.open(successView.render());
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
        });
}, handleBuyerFieldChange);

const orderForm = new OrderForm(() => {
    modalView.open(contactsForm.render());
}, handleBuyerFieldChange);

buyerModel.on('buyer:changed', () => {
    const data = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.setValues({
        payment: data.payment,
        address: data.address,
    });
    orderForm.setErrors({
        payment: errors.payment,
        address: errors.address,
    });
    orderForm.setValid(!errors.payment && !errors.address);

    contactsForm.setValues({
        email: data.email,
        phone: data.phone,
    });
    contactsForm.setErrors({
        email: errors.email,
        phone: errors.phone,
    });
    contactsForm.setValid(!errors.email && !errors.phone);
});

const basketView = new BasketView(() => {
    modalView.open(orderForm.render());
});

const createBasketCards = (): HTMLElement[] => basketModel.getItems().map((product, index) => {
    const card = new CardBasket(() => events.emit('basket:remove', { id: product.id }));

    return card.render({ product, index: String(index + 1) });
});

events.on('basket:open', () => {
    modalView.open(basketView.render());
});

productsModel.on('products:changed', () => {
    galleryView.render(createCatalogCards());
});

basketModel.on('basket:changed', () => {
    headerView.setCounter(basketModel.getCount());
    basketView.render({
        items: createBasketCards(),
        total: basketModel.getTotalPrice(),
    });
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
    const product = productsModel.getItem(id);
    if (product) {
        basketModel.removeItem(product);
    }
});

api.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка получения каталога:', error);
    });

galleryView.render();

