import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { ProductCardBase } from './ProductCardBase';

export interface IPreviewState {
    product: IProduct;
    isInBasket: boolean;
}

export class CardPreview extends ProductCardBase<IPreviewState> {
    private readonly buttonElement: HTMLButtonElement;
    private readonly descriptionElement: HTMLParagraphElement;

    constructor(private readonly onAction: () => void) {
        super(cloneTemplate<HTMLDivElement>('#card-preview'));
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this.buttonElement.addEventListener('click', () => {
            this.onAction();
        });
    }

    public render(state: IPreviewState): HTMLElement {
        const { product, isInBasket } = state;
        this.fillProduct(product);
        this.fillProductDetails(product);
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
