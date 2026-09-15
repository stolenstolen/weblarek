import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CardBase } from './CardBase';

export abstract class ProductCardBase<T = IProduct> extends CardBase<T> {
    protected readonly imageElement: HTMLImageElement;
    protected readonly categoryElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    }

    protected fillProductDetails(product: IProduct): void {
        const categoryClass = categoryMap[product.category as keyof typeof categoryMap] ?? 'card__category_other';
        this.categoryElement.textContent = product.category;
        this.categoryElement.classList.remove(...Object.values(categoryMap));
        this.categoryElement.classList.add(categoryClass);
        this.imageElement.src = `${CDN_URL}${product.image}`;
        this.imageElement.alt = product.title;
    }
}
