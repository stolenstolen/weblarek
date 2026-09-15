import { TPayment } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { FormBase } from './FormBase';

export interface IOrderFormState extends Record<string, string | null> {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends FormBase<IOrderFormState> {
    private readonly paymentButtons: HTMLButtonElement[];
    private readonly addressInput: HTMLInputElement;

    constructor(private readonly onSubmit: (data: IOrderFormState) => void) {
        super(cloneTemplate<HTMLFormElement>('#order') as HTMLFormElement);
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll<HTMLButtonElement>('[name]'))
            .filter((button) => button.name === 'card' || button.name === 'cash');

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => this.selectPayment(button.name as TPayment));
        });

        this.addressInput.addEventListener('input', () => this.handleInputChange());
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit({
                payment: this.getSelectedPayment(),
                address: this.addressInput.value,
            });
        });
    }

    public render(state: IOrderFormState): HTMLElement {
        const { payment, address } = state;
        this.clearErrors();
        this.addressInput.value = address ?? '';
        this.selectPayment(payment ?? null, false);
        this.handleInputChange();
        return this.container;
    }

    public validate(): boolean {
        const payment = this.getSelectedPayment();
        const address = this.addressInput.value.trim();
        const isValid = Boolean(payment) && Boolean(address);
        this.updateSubmitState(isValid);
        return isValid;
    }

    private getSelectedPayment(): TPayment | null {
        const active = this.paymentButtons.find((button) => button.classList.contains('button_alt-active'));
        return active ? (active.name as TPayment) : null;
    }

    private selectPayment(payment: TPayment | null, notify = true): void {
        this.paymentButtons.forEach((button) => {
            const isActive = button.name === payment;
            button.classList.toggle('button_alt-active', isActive);
            button.classList.toggle('button_alt', !isActive);
        });
        if (notify) {
            this.handleInputChange();
        }
    }

    private handleInputChange(): void {
        const payment = this.getSelectedPayment();
        const address = this.addressInput.value.trim();
        const errors: Record<string, string> = {};

        if (!payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!address) {
            errors.address = 'Введите адрес доставки';
        }

        this.setErrors(errors);
        this.updateSubmitState(Boolean(payment) && Boolean(address));
    }
}
