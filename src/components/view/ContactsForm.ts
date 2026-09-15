import { IBuyer } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { FormBase } from './FormBase';

export type ContactsFormState = Pick<IBuyer, 'email' | 'phone'>;

export class ContactsForm extends FormBase<ContactsFormState> {
    private readonly emailInput: HTMLInputElement;
    private readonly phoneInput: HTMLInputElement;

    constructor(
        private readonly onSubmit: () => void,
        private readonly onChange: (field: 'email' | 'phone', value: string) => void,
    ) {
        super(cloneTemplate<HTMLFormElement>('#contacts') as HTMLFormElement);
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.onChange('email', this.emailInput.value);
        });
        this.phoneInput.addEventListener('input', () => {
            this.onChange('phone', this.phoneInput.value);
        });
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    public render(): HTMLElement {
        return this.container;
    }

    public setValues(state: ContactsFormState): void {
        this.emailInput.value = state.email ?? '';
        this.phoneInput.value = state.phone ?? '';
    }
}
