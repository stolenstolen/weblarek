import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { CardBasket } from './CardBasket';

export class BasketView extends Component<{ items: IProduct[]; total: number }> {
    private readonly listElement: HTMLElement;
    private readonly totalElement: HTMLElement;
    private readonly submitButton: HTMLButtonElement;

    constructor(private readonly onRemove: (id: string) => void, private readonly onCheckout: () => void) {
        super(cloneTemplate<HTMLDivElement>('#basket'));
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.submitButton.addEventListener('click', this.onCheckout);
    }

    public render(data: { items: IProduct[]; total: number } = { items: [], total: 0 }): HTMLElement {
        const { items, total } = data;
        this.listElement.innerHTML = '';

        if (items.length === 0) {
            this.submitButton.disabled = true;
            this.totalElement.textContent = '0 синапсов';
            return this.container;
        }

        this.submitButton.disabled = false;
        this.totalElement.textContent = `${total} синапсов`;

        items.forEach((product, index) => {
            const card = new CardBasket((id) => this.onRemove(id));
            this.listElement.append(card.render({ product, index }));
        });

        return this.container;
    }
}
