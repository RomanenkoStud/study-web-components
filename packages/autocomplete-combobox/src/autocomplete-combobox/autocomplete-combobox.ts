import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './autocomplete-combobox.css';
import { ComboboxAriaController, ComboboxKeyboardController } from '../controllers';

export type AutocompleteComboboxElement = HTMLElement & {
    options: string[];
    selectedValue: string;
}

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends LitElement {
    static styles = styles;

    protected comboboxController = new ComboboxAriaController(this);
    protected keyboardController = new ComboboxKeyboardController(this);

    @property({ type: String }) selectedValue = '';
    @property({ type: Number, attribute: 'max-height' }) maxHeight = 150;
    @state() isFocused: boolean = false;
    @state() filterValue = '';

    private _options: Set<string> = new Set();

    set options(newOptions: string[]) {
        newOptions.forEach((option) => {
            if (this._options.has(option)) {
                console.warn(`Duplicate option value found: ${option}`)
            } 
            this._options.add(option);
        })
    }

    @property({ type: Array })
    get options() {
        return Array.from(this._options);
    }

    firstUpdated() {
        if (this._options.size === 0) {
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
        this.isFocused = true;
    }

    onInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        const newValue = inputElement.value;

        this.filterValue = newValue;
    }

    onOptionClick(value: string) {
        this.selectedValue = value;
        this.filterValue = value;
        this.isFocused = false;
    }

    onBackgroundPointerUp(event) {
        if (!this.isEqualNode(event.target)) {
            this.isFocused = false;
        }
    }

    render() {
        return html`
            <input
                ariaHasPopup
                type="text"
                class="combobox"
                .value=${this.filterValue}
                @input=${this.onInput}
                @focus=${this.onInputFocus}
            />
            <ul 
                class="options-list ${this.isFocused ? '' : 'hidden'}"
                style="--maxHeight: ${this.maxHeight}px"
            >
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
