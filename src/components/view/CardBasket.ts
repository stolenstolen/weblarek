import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CardBase } from './CardBase';

export interface IBasketCardState {
    product: IProduct;
    index: string;
}

export class CardBasket extends CardBase<IBasketCardState> {
    private readonly indexElement: HTMLElement;
    private readonly actionElement: HTMLButtonElement;

    constructor(private readonly onAction: () => void) {
        super(cloneTemplate<HTMLLIElement>('#card-basket'));
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.actionElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.actionElement.addEventListener('click', () => {
            this.onAction();
        });
    }

    public render(state: IBasketCardState): HTMLElement {
        const { product, index } = state;
        this.fillProduct(product);
        this.indexElement.textContent = index;
        this.priceElement.textContent = this.formatPrice(product.price);
        this.actionElement.title = 'Удалить товар';
        return this.container;
    }
}
