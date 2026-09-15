import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class HeaderView extends Component<null> {
    private readonly basketButton: HTMLButtonElement;
    private readonly basketCounter: HTMLElement;

    constructor(private readonly onBasketClick: () => void) {
        super(ensureElement<HTMLElement>('.header'));
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton.addEventListener('click', this.onBasketClick);
    }

    public render(): HTMLElement {
        return this.container;
    }

    public setCounter(count: number): void {
        this.basketCounter.textContent = String(count);
    }
}
