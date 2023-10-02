import { ReactiveControllerHost } from 'lit';
import { ComboboxElement } from '../combobox';

export class ComboboxKeyboardController {
    private activeElementIndex = -1;

    constructor(private host: ReactiveControllerHost & ComboboxElement) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    hostUpdated() { 
        this.activeElementIndex = -1;

        this.updateVisualFocus();
    }

    hostDisconnected() {
        this.host.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Tab':
                if (this.host.ariaExpanded === 'true') {
                    event.preventDefault();
                    this.shiftFocus(1);
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (event.altKey) {
                    this.host.showOptions();
                }
                this.shiftFocus(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.shiftFocus(-1);
                break;
            case 'Enter':
                if (this.activeElementIndex > -1) {
                    event.preventDefault();
                    const activeElement = this.host.optionElements[this.activeElementIndex];
                    this.host.value = activeElement.id;
                }
                this.host.hideOptions();
                break;
            case 'Escape':
                event.preventDefault();
                this.host.hideOptions();
                break;
            case 'Home':
                event.preventDefault();
                this.setFocus(0);
                break;
            case 'End':
                event.preventDefault();
                this.setFocus(this.host.optionElements.length - 1);
                break;
            default:
                break;
        }

        this.updateVisualFocus();
    }

    private shiftFocus(shift: number): void {
        const optionElements = this.host.optionElements;

        if (!Array.from(optionElements).find(element => !element.hasAttribute('disabled'))) {
            return;
        }

        let newIndex = this.activeElementIndex < 0 && shift < 0 
            ? optionElements.length - 1
            : (this.activeElementIndex + shift + optionElements.length) % optionElements.length;

        while (optionElements[newIndex].hasAttribute('disabled')) {
            newIndex = (newIndex + shift) % optionElements.length;
        }

        this.setFocus(newIndex);
    }

    private setFocus(index: number): void {
        this.activeElementIndex = index;

        this.updateVisualFocus();
    }

    private updateVisualFocus() {
        this.host.optionElements.forEach((element, index) => {
            if (index === this.activeElementIndex) {
                element.setAttribute('part', 'option option-focused');
                element.scrollIntoViewIfNeeded();
            } else {
                element.setAttribute('part', 'option');
            }
        });
    }
}