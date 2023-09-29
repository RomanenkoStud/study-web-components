import { ReactiveControllerHost } from 'lit';
import { AutocompleteCombobox } from '../autocomplete-combobox/autocomplete-combobox';

interface OptionElement extends HTMLElement {
    // element.scrollintoviewifneeded-polyfill
    scrollIntoViewIfNeeded: () => void;
}

export class ComboboxKeyboardController {
    private activeElementIndex = -1;

    constructor(private host: ReactiveControllerHost & AutocompleteCombobox) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    hostUpdated() { 
        this.activeElementIndex = -1;

        const optionElements = this.host.shadowRoot
            ?.querySelectorAll('[role="option"]') as NodeListOf<OptionElement>;
        this.updateVisualFocus(optionElements);
    }

    hostDisconnected() {
        this.host.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        const popover = this.host.shadowRoot
            ?.querySelector('[role="listbox"]') as HTMLElement;
        const optionElements = this.host.shadowRoot
            ?.querySelectorAll('[role="option"]') as NodeListOf<OptionElement>;

        if (!optionElements || !popover) {
            return;
        }

        switch (event.key) {
            case 'Tab':
                if (this.host.ariaExpanded === 'true') {
                    event.preventDefault();
                    this.shiftFocus(1, optionElements);
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (event.altKey) {
                    this.host.ariaExpanded = "true";
                    popover.showPopover();
                }
                this.shiftFocus(1, optionElements);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.shiftFocus(-1, optionElements);
                break;
            case 'Enter':
                event.preventDefault();
                if (this.activeElementIndex > -1) {
                    this.selectOption(optionElements[this.activeElementIndex]);
                    this.host.ariaExpanded = "false";
                    popover.hidePopover();
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.host.ariaExpanded = "false";
                popover.hidePopover();
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

    private shiftFocus(shift: number, optionElements: NodeListOf<OptionElement>): void {
        if (!Array.from(optionElements).find(element => !element.hasAttribute('disabled'))) {
            return;
        }

        let newIndex = this.activeElementIndex < 0 && shift < 0 
            ? optionElements.length - 1
            : (this.activeElementIndex + shift + optionElements.length) % optionElements.length;

        while (optionElements[newIndex].hasAttribute('disabled')) {
            newIndex = (newIndex + shift) % optionElements.length;
        }

        this.setFocus(newIndex, optionElements);
    }

    private setFocus(index: number, optionElements: NodeListOf<OptionElement>): void {
        this.activeElementIndex = index;

        this.updateVisualFocus(optionElements);
    }

    private updateVisualFocus(optionElements: NodeListOf<OptionElement>) {
        optionElements.forEach((element, index) => {
            if (index === this.activeElementIndex) {
                element.setAttribute('part', 'option option-focused');
                element.scrollIntoViewIfNeeded();
            } else {
                element.setAttribute('part', 'option');
            }
        });
    }

    private selectOption(option: HTMLElement) {
        this.host.value = option.id;
    }
}