import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ComboboxAriaController, ComboboxKeyboardController } from '../controllers';
import "@oddbird/popover-polyfill";

// @ts-ignore
import popoverPolyfill from "@oddbird/popover-polyfill/dist/popover.css?inline";
import { styles } from './autocomplete-combobox.css';

export type AutocompleteComboboxElement = HTMLElement & {
    options: string[];
    selectedValue: string;
}

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends LitElement {
    static styles = [unsafeCSS(popoverPolyfill), styles];

    protected comboboxController = new ComboboxAriaController(this);
    protected keyboardController = new ComboboxKeyboardController(this);

    @property({ type: String }) value = '';
    @state() filterValue = '';

    private _options: Set<string> = new Set();

    set options(newOptions: string[]) {
        newOptions.forEach((option) => {
            if (this._options.has(option)) {
                console.warn(`Duplicate option value found: ${option}`)
            } 
            this._options.add(option);
        })
        this.requestUpdate("options")
    }

    @property({ type: Array })
    get options() {
        return Array.from(this._options);
    }

    firstUpdated() {
        if (this.options.length === 0) {
            const slot = this.shadowRoot?.querySelector('slot');
            slot?.addEventListener('slotchange', () => {
                const optionElements = slot.assignedNodes().filter((node) =>
                    node instanceof HTMLOptionElement
                ) as HTMLOptionElement[];
    
                this.options = optionElements.map((element) => element.value);
            });
        }
        document.addEventListener('pointerup', this.onBackgroundPointerUp.bind(this));
    }

    onInputFocus(e: FocusEvent) {
        this.ariaExpanded = "true";
        this.shadowRoot?.querySelector('ul')?.showPopover();
    }

    onInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        const newValue = inputElement.value;

        this.filterValue = newValue;
    }

    onOptionClick(value: string) {
        this.value = value;
        this.filterValue = value;
        this.ariaExpanded = "false";
        this.shadowRoot?.querySelector('ul')?.hidePopover();
    }

    onBackgroundPointerUp(event: Event) {
        if (!this.isEqualNode(event.target as HTMLElement)) {
            this.ariaExpanded = "false";
            this.shadowRoot?.querySelector('ul')?.hidePopover();
        }
    }

    render() {
        return html`
            <input
                type="text"
                .value=${this.filterValue}
                @input=${this.onInput}
                @focus=${this.onInputFocus}
                popovertarget=options
            />
            <ul popover="manual" class="options" id=options>
                ${this.options
                    .filter((value) =>
                        value
                            .toLowerCase()
                            .includes(this.filterValue.toLowerCase())
                    )
                    .map((value) => 
                        html`
                            <li
                                role="option"
                                class="option"
                                id=${value}
                                @click=${() => {
                                    this.onOptionClick(value)
                                }}
                            >${value}</li>
                        `
                    )
                }
            </ul>
            <slot hidden></slot>
        `;
    }
}
