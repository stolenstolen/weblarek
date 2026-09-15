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

    constructor(
        private readonly onSubmit: () => void,
        private readonly onChange: (field: 'payment' | 'address', value: string) => void,
    ) {
        super(cloneTemplate<HTMLFormElement>('#order') as HTMLFormElement);
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll<HTMLButtonElement>('[name]'))
            .filter((button) => button.name === 'card' || button.name === 'cash');

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.onChange('payment', button.name);
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.onChange('address', this.addressInput.value);
        });
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    public render(): HTMLElement {
        return this.container;
    }

    public setValues(state: IOrderFormState): void {
        this.addressInput.value = state.address ?? '';
        this.selectPayment(state.payment ?? null);
    }

    private selectPayment(payment: TPayment | null): void {
        this.paymentButtons.forEach((button) => {
            const isActive = button.name === payment;
            button.classList.toggle('button_alt-active', isActive);
            button.classList.toggle('button_alt', !isActive);
        });
    }
}
