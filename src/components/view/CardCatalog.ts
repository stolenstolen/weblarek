import { IProduct } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { CardAction, CardBase } from './CardBase';

export class CardCatalog extends CardBase<IProduct> {
    private currentId = '';

    constructor(private readonly onAction: (id: string, action: CardAction) => void) {
        super(cloneTemplate<HTMLButtonElement>('#card-catalog'));
        this.container.addEventListener('click', () => {
            if (this.container.disabled) {
                return;
            }
            this.onAction(this.currentId, 'select');
        });
    }

    public render(product: IProduct): HTMLElement {
        this.currentId = product.id;
        this.container.dataset.id = product.id;
        this.container.disabled = false;
        this.container.setAttribute('aria-disabled', 'false');
        this.fillProduct(product);
        return this.container;
    }
}
