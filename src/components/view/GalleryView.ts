import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class GalleryView extends Component<HTMLElement[]> {
    constructor() {
        super(ensureElement<HTMLElement>('.gallery'));
    }

    public render(data: HTMLElement[] = []): HTMLElement {
        this.container.innerHTML = '';
        this.container.append(...data);
        return this.container;
    }
}
