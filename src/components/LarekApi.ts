import { IApi, IOrder, IOrderResult, IProductsResult } from '../types';

export class LarekApi {
    constructor(private readonly api: IApi) { }

    getProducts(): Promise<IProductsResult> {
        return this.api.get<IProductsResult>('/product/');
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}