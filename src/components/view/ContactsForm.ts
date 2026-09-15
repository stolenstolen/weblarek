import { IBuyer } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { FormBase } from './FormBase';

export type ContactsFormState = Pick<IBuyer, 'email' | 'phone'>;

export class ContactsForm extends FormBase<ContactsFormState> {
    private readonly emailInput: HTMLInputElement;
    private readonly phoneInput: HTMLInputElement;

    constructor(private readonly onSubmit: (data: ContactsFormState) => void) {
        super(cloneTemplate<HTMLFormElement>('#contacts') as HTMLFormElement);
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => this.handleInputChange());
        this.phoneInput.addEventListener('input', () => this.handleInputChange());
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit({
                email: this.emailInput.value,
                phone: this.phoneInput.value,
            });
        });
    }

    public render(state: ContactsFormState): HTMLElement {
        this.clearErrors();
        this.emailInput.value = state.email ?? '';
        this.phoneInput.value = state.phone ?? '';
        this.handleInputChange();
        return this.container;
    }

    public validate(): boolean {
        const isValid = Boolean(this.emailInput.value.trim()) && Boolean(this.phoneInput.value.trim());
        this.updateSubmitState(isValid);
        return isValid;
    }

    private handleInputChange(): void {
        const errors: Record<string, string> = {};
        if (!this.emailInput.value.trim()) {
            errors.email = 'Введите email';
        }
        if (!this.phoneInput.value.trim()) {
            errors.phone = 'Введите телефон';
        }

        this.setErrors(errors);
        this.updateSubmitState(Boolean(this.emailInput.value.trim()) && Boolean(this.phoneInput.value.trim()));
    }
}
