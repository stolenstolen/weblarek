import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class BasketView extends Component<{ items: HTMLElement[]; total: number }> {
    private readonly listElement: HTMLElement;
    private readonly totalElement: HTMLElement;
    private readonly submitButton: HTMLButtonElement;

    constructor(private readonly onCheckout: () => void) {
        super(cloneTemplate<HTMLDivElement>('#basket'));
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.submitButton.disabled = true;
        this.submitButton.addEventListener('click', this.onCheckout);
    }

    public render(data?: { items: HTMLElement[]; total: number }): HTMLElement {
        if (!data) {
            return this.container;
        }

        const { items, total } = data;
        this.listElement.innerHTML = '';
        this.totalElement.textContent = `${total} синапсов`;

        if (items.length === 0) {
            this.submitButton.disabled = true;
            return this.container;
        }

        this.submitButton.disabled = false;

        this.listElement.append(...items);

        return this.container;
    }
}
