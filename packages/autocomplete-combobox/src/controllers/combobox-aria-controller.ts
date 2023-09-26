import { ReactiveControllerHost } from 'lit';

// Add ARIA attributes and other accessibility features.
export class ComboboxAriaController {
    constructor(private host: ReactiveControllerHost & HTMLElement) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.setAttribute('role', 'combobox');
        this.host.setAttribute('aria-haspopup', 'listbox');
    }

    hostUpdated() { 
        this.activeElementIndex = -1;
        
        this.host.shadowRoot
            .querySelector('input[type="text"]')
            .setAttribute('aria-expanded', this.host.isFocused.toString());

        if(this.host.isFocused) {
            this.host.shadowRoot
            .querySelector('ul')
            .setAttribute('role', 'listbox');
        }
    }
}
