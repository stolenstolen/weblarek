import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export type CardAction = 'select' | 'toggle' | 'delete';

export abstract class CardBase<T = IProduct> extends Component<T> {
    protected readonly titleElement: HTMLHeadingElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    protected fillProduct(product: IProduct): void {
        this.titleElement.textContent = product.title;
        this.priceElement.textContent = this.formatPrice(product.price);
    }

    protected formatPrice(price: number | null): string {
        return price === null ? 'Недоступно' : `${price} синапсов`;
    }
}
