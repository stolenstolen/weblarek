import { IApi, IOrderPayload, IOrderResult, IProductsResponse } from '../types';

export class ApiService {
    private readonly api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    public getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    public createOrder(data: IOrderPayload): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', data);
    }
}
