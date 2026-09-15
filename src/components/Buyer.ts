import { IBuyer, TPayment } from '../types';
import { EventEmitter } from './base/Events';

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer extends EventEmitter {
    private data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: '',
    };

    private emitChange(): void {
        this.emit('buyer:changed', { data: this.data });
    }

    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
        this.emitChange();
    }

    getData(): IBuyer {
        return this.data;
    }

    clear(): void {
        this.data = {
            payment: null,
            email: '',
            phone: '',
            address: '',
        };
        this.emitChange();
    }

    validate(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.data.address?.trim()) {
            errors.address = 'Укажите адрес';
        }
        if (!this.data.email?.trim()) {
            errors.email = 'Укажите емэйл';
        }
        if (!this.data.phone?.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }

    setPayment(payment: TPayment): void {
        this.setData({ payment });
    }

    setAddress(address: string): void {
        this.setData({ address });
    }

    setEmail(email: string): void {
        this.setData({ email });
    }

    setPhone(phone: string): void {
        this.setData({ phone });
    }
}