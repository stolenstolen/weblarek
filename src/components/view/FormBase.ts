import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class FormBase<T extends Record<string, string | null>> extends Component<T> {
    protected readonly submitButton: HTMLButtonElement;
    protected readonly errorsElement: HTMLElement;

    protected constructor(container: HTMLFormElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);
    }

    public setErrors(errors: Partial<Record<string, string>>): void {
        const messages = Object.values(errors).filter(Boolean);
        this.errorsElement.textContent = messages.join(' ');
        this.errorsElement.classList.toggle('form__errors_active', messages.length > 0);
    }

    protected updateSubmitState(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    protected clearErrors(): void {
        this.errorsElement.textContent = '';
        this.errorsElement.classList.remove('form__errors_active');
    }
}
