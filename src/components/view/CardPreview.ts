import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CardAction, CardBase } from './CardBase';

export interface IPreviewState {
    product: IProduct;
    isInBasket: boolean;
}

export class CardPreview extends CardBase<IPreviewState> {
    private readonly buttonElement: HTMLButtonElement;
    private readonly descriptionElement: HTMLParagraphElement;

    constructor(private readonly onAction: (id: string, action: CardAction) => void) {
        super(cloneTemplate<HTMLDivElement>('#card-preview'));
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this.buttonElement.addEventListener('click', () => {
            if (this.container.dataset.id) {
                this.onAction(this.container.dataset.id, 'toggle');
            }
        });
    }

    public render(state: IPreviewState): HTMLElement {
        const { product, isInBasket } = state;
        this.container.dataset.id = product.id;
        this.fillProduct(product);
        this.descriptionElement.textContent = product.description;

        const productIsAvailable = product.price !== null;
        this.buttonElement.disabled = !productIsAvailable;
        this.buttonElement.textContent = !productIsAvailable
            ? 'Недоступно'
            : isInBasket
                ? 'Удалить из корзины'
                : 'Купить';

        return this.container;
    }
}
