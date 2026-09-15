import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class SuccessView extends Component<null> {
    private readonly descriptionElement: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(private readonly onClose: () => void) {
        super(cloneTemplate<HTMLDivElement>('#success'));
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.closeButton.addEventListener('click', this.onClose);
    }

    public render(): HTMLElement {
        return this.container;
    }

    public setTotal(total: number): void {
        this.descriptionElement.textContent = `Списано ${total} синапсов`;
    }
}
