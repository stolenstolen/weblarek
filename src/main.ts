import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Basket } from './components/Basket';
import { Buyer } from './components/Buyer';
import { LarekApi } from './components/LarekApi';
import { Products } from './components/Products';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItem(apiProducts.items[0].id));
productsModel.setSelected(apiProducts.items[0]);
console.log('Товар для подробного отображения:', productsModel.getSelected());

const basketModel = new Basket();
const firstProduct: IProduct = apiProducts.items[0];
basketModel.addItem(firstProduct);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Товар есть в корзине:', basketModel.hasItem(firstProduct.id));
console.log('Количество товаров:', basketModel.getCount());
console.log('Стоимость товаров:', basketModel.getTotalPrice());
basketModel.removeItem(firstProduct);
console.log('Корзина после удаления:', basketModel.getItems());
basketModel.addItem(firstProduct);
basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

const buyerModel = new Buyer();
console.log('Данные покупателя при загрузке:', buyerModel.getData());
console.log('Ошибки валидации пустых данных:', buyerModel.validate());

buyerModel.setPayment('card');
console.log('Ошибки после выбора оплаты:', buyerModel.validate());

buyerModel.setAddress('Москва');
console.log('Ошибки после указания адреса:', buyerModel.validate());

buyerModel.setEmail('buyer@example.com');
console.log('Ошибки после указания емэйла:', buyerModel.validate());

buyerModel.setPhone('+79990000000');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации заполненных данных:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Ошибки валидации после очистки:', buyerModel.validate());

const webLarekApi = new LarekApi(new Api(API_URL));
webLarekApi.getProducts()
    .then((products) => {
        productsModel.setItems(products.items);
        console.log('Каталог, полученный с сервера:', productsModel.getItems());
    })
    .catch((error) => console.error('Ошибка получения каталога:', error));
