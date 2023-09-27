import { ReactiveControllerHost } from 'lit';

export class ComboboxKeyboardController {
    private activeElementIndex = -1;

    constructor(private host: ReactiveControllerHost & HTMLElement) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    hostUpdated() { 
        this.activeElementIndex = -1;
    }

    private handleKeyDown(event: KeyboardEvent) {
        const popover = this.host.shadowRoot
            ?.querySelector('[popover]') as HTMLElement;
        const optionElements = this.host.shadowRoot
            ?.querySelectorAll('[popover] > *') as NodeListOf<HTMLElement>;

        if (!optionElements || !popover) {
            return
        }

        switch (event.key) {
            case 'Tab':
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
                if (this.activeElementIndex > 0) {
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

    private shiftFocus(shift: number, optionElements: NodeListOf<HTMLElement>): void {
        const newIndex = this.activeElementIndex < 0 && shift < 0 
            ? optionElements.length - 1
            : (this.activeElementIndex + shift + optionElements.length) % optionElements.length;

        this.setFocus(newIndex, optionElements);
    }

    private setFocus(index: number, optionElements: NodeListOf<HTMLElement>): void {
        this.activeElementIndex = index;

        this.updateVisualFocus(optionElements);
    }

    private updateVisualFocus(optionElements: NodeListOf<HTMLElement>) {
        optionElements.forEach((element, index) => {
            element.classList.toggle('focused', index === this.activeElementIndex);
            index === this.activeElementIndex && element.scrollIntoView(false);
        });
    }

    private selectOption(option: HTMLElement) {
        const selectedValue = option.textContent || '';
        this.host.value = selectedValue;
        this.host.filterValue = selectedValue;
    }
}