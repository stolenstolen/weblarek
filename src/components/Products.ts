import { IProduct } from '../types';
import { EventEmitter } from './base/Events';

export class Products extends EventEmitter {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
        this.emit('products:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelected(product: IProduct | null): void {
        this.selectedProduct = product;
        this.emit('products:selected', { product: this.selectedProduct });
    }

    getSelected(): IProduct | null {
        return this.selectedProduct;
    }
}