import { IBuyer, TPayment } from '../types';

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
    }

    getData(): Partial<IBuyer> {
        return this.data;
    }

    clear(): void {
        this.data = {};
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