import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class ModalView extends Component<null> {
    private readonly contentElement: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor() {
        super(ensureElement<HTMLElement>('#modal-container'));
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        this.close();
    }

    public open(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.append(content);
        this.container.classList.add('modal_active');
    }

    public close(): void {
        this.contentElement.innerHTML = '';
        this.container.classList.remove('modal_active');
    }
}
