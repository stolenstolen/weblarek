import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export type CardAction = 'select' | 'toggle' | 'delete';

export abstract class CardBase<T = IProduct> extends Component<T> {
    protected readonly titleElement: HTMLHeadingElement;
    protected readonly imageElement: HTMLImageElement;
    protected readonly categoryElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    protected fillProduct(product: IProduct): void {
        const categoryClass = categoryMap[product.category as keyof typeof categoryMap] ?? 'card__category_other';
        this.titleElement.textContent = product.title;
        this.categoryElement.textContent = product.category;
        this.categoryElement.classList.remove(...Object.values(categoryMap));
        this.categoryElement.classList.add(categoryClass);
        this.imageElement.src = `${CDN_URL}${product.image}`;
        this.imageElement.alt = product.title;
        this.priceElement.textContent = this.formatPrice(product.price);
    }

    protected formatPrice(price: number | null): string {
        return price === null ? 'Недоступно' : `${price} синапсов`;
    }
}
