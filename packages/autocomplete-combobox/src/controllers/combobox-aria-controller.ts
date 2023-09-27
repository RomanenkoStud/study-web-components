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
        if(this.host.ariaExpanded === "true") {
            this.host.shadowRoot
                ?.querySelector('ul')
                ?.setAttribute('role', 'listbox');
        }
    }
}
