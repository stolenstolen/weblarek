import { IProduct } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { ProductCardBase } from './ProductCardBase';

export class CardCatalog extends ProductCardBase<IProduct> {
    private readonly buttonElement: HTMLButtonElement;

    constructor(private readonly onAction: () => void) {
        super(cloneTemplate<HTMLButtonElement>('#card-catalog'));
        this.buttonElement = this.container as HTMLButtonElement;
        this.container.addEventListener('click', () => {
            if (this.buttonElement.disabled) {
                return;
            }
            this.onAction();
        });
    }

    public render(product: IProduct): HTMLElement {
        this.buttonElement.disabled = false;
        this.container.setAttribute('aria-disabled', 'false');
        this.fillProduct(product);
        this.fillProductDetails(product);
        return this.container;
    }
}
