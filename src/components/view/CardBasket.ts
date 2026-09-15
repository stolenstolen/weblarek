import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CardAction, CardBase } from './CardBase';

export interface IBasketCardState {
    product: IProduct;
    index: number;
}

export class CardBasket extends CardBase<IBasketCardState> {
    private readonly indexElement: HTMLElement;
    private readonly actionElement: HTMLButtonElement;

    constructor(private readonly onAction: (id: string, action: CardAction) => void) {
        super(cloneTemplate<HTMLLIElement>('#card-basket'));
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.actionElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.actionElement.addEventListener('click', () => {
            if (this.container.dataset.id) {
                this.onAction(this.container.dataset.id, 'delete');
            }
        });
    }

    public render(state: IBasketCardState): HTMLElement {
        const { product, index } = state;
        this.container.dataset.id = product.id;
        this.fillProduct(product);
        this.indexElement.textContent = String(index + 1);
        this.priceElement.textContent = this.formatPrice(product.price);
        this.actionElement.title = 'Удалить товар';
        return this.container;
    }
}
