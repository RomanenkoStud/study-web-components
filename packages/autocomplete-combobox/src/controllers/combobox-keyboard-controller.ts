import { ReactiveControllerHost } from 'lit';

export class ComboboxKeyboardController {
    private activeElementIndex = -1;

    constructor(private host: ReactiveControllerHost & HTMLElement, targetSelector) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    hostUpdated() { 
        this.activeElementIndex = -1;
    }

    private handleKeyDown(event: KeyboardEvent) {
        const optionElements = this.host.shadowRoot.querySelectorAll('li');

        switch (event.key) {
            case 'Tab':
            case 'ArrowDown':
                event.preventDefault();
                if (event.altKey) {
                    this.host.isFocused = true;
                }
                this.shiftFocus(1, optionElements);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.shiftFocus(-1, optionElements);
                break;
            case 'Enter':
                event.preventDefault();
                this.selectOption(optionElements[this.activeElementIndex]);
                break;
            case 'Escape':
                event.preventDefault();
                this.host.isFocused = false;
                break;
            case 'Home':
                event.preventDefault();
                this.setFocus(0, optionElements);
                break;
            case 'End':
                event.preventDefault();
                this.setFocus(optionElements.length - 1, optionElements);
                break;
            default:
                break;
        }

        this.updateVisualFocus(optionElements);
    }

    private shiftFocus(shift, optionElements: NodeListOf<HTMLElement>): number {
        const newIndex = this.activeElementIndex < 0 && shift < 0 
            ? optionElements.length - 1
            : (this.activeElementIndex + shift + optionElements.length) % optionElements.length;

        this.setFocus(newIndex, optionElements);
    }

    private setFocus(index, optionElements: NodeListOf<HTMLElement>): number {
        this.activeElementIndex = index;

        this.updateVisualFocus(optionElements);
    }

    private updateVisualFocus(optionElements: NodeListOf<HTMLElement>) {
        optionElements.forEach((element, index) => {
            element.classList.toggle('focused', index === this.activeElementIndex);
        });
    }

    private selectOption(option: HTMLElement) {
        const selectedValue = option.textContent || '';
        this.host.filterValue = selectedValue;
        this.host.isFocused = false;
    }
}