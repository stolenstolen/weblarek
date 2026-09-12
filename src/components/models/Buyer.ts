import { IBuyer, TPayment } from '../../types';

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private payment: TPayment | null = null;
    private email = '';
    private phone = '';
    private address = '';

    public setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        if (field === 'payment') {
            this.payment = value as TPayment | null;
            return;
        }

        if (field === 'email') {
            this.email = String(value ?? '');
            return;
        }

        if (field === 'phone') {
            this.phone = String(value ?? '');
            return;
        }

        if (field === 'address') {
            this.address = String(value ?? '');
        }
    }

    public getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    public clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    public validate(): BuyerErrors {
        const errors: BuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
