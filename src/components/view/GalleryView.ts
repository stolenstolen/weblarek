import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { CardCatalog } from './CardCatalog';

export class GalleryView extends Component<IProduct[]> {
    private readonly items: HTMLElement[] = [];

    constructor(private readonly onCardSelect: (id: string) => void) {
        super(ensureElement<HTMLElement>('.gallery'));
    }

    public render(data: IProduct[] = []): HTMLElement {
        this.container.innerHTML = '';
        this.items.length = 0;

        data.forEach((product) => {
            const card = new CardCatalog((id) => this.onCardSelect(id));
            this.items.push(card.render(product));
        });

        this.items.forEach((item) => this.container.append(item));
        return this.container;
    }
}
