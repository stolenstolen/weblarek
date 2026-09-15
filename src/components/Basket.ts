import { IProduct } from '../types';
import { EventEmitter } from './base/Events';

export class Basket extends EventEmitter {
    private items: IProduct[] = [];

    private emitChange(): void {
        this.emit('basket:changed', {
            items: this.items,
            total: this.getTotalPrice(),
            count: this.getCount(),
        });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.emitChange();
        }
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter((item) => item.id !== product.id);
        this.emitChange();
    }

    clear(): void {
        this.items = [];
        this.emitChange();
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}