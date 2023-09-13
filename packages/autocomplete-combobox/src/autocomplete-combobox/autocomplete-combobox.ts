import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './autocomplete-combobox.css';

export { ComboboxInput } from '../combobox-input';
export { OptionsList } from '../options-list';

export type AutocompleteComboboxElement = HTMLElement & {
    options: string[];
    selectedValue: string;
}

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends LitElement {
    static styles = styles;

    @property({ type: String }) selectedValue = '';
    @property({ type: Number, attribute: 'max-height' }) maxHeight = 150;
    @state() isFocused: boolean = false;
    @state() filterValue = '';

    private _options: string[] = [];

    set options(newOptions: string[]) {
        const uniqueValues = new Set<string>();

        for (const element of newOptions) {
            const value = element;

            if (uniqueValues.has(value)) {
                throw new Error(`Duplicate option value found: ${value}`);
            }

            uniqueValues.add(value);
        }

        this._options = newOptions;
    }

    @property({ type: Array })
    get options() {
        return this._options;
    }

    firstUpdated() {
        const slot = this.shadowRoot?.querySelector('slot');
        slot?.addEventListener('slotchange', () => {
            const assignedNodes = slot.assignedNodes();
            const optionElements = assignedNodes.filter((node) =>
                node instanceof HTMLOptionElement
            ) as HTMLOptionElement[];

            this.options = optionElements.map((element) => element.value);
        });
    }

    onOptionClick(e: CustomEvent) {
        const optionValue = e.detail;

        this.selectedValue = optionValue;
        this.filterValue = optionValue;
        this.isFocused = false;
    }

    onInputChange(event: CustomEvent) {
        this.filterValue = event.detail || '';
    }

    onBlur(e: FocusEvent) {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.classList.contains('options')) {
            this.isFocused = false;
        }
    }

    onInputFocus(e: FocusEvent) {
        this.isFocused = true;
    }

    render() {
        return html`
            <combobox-input
                .value=${this.selectedValue}
                @combobox-input=${this.onInputChange}
                @focus=${this.onInputFocus}
                @blur=${this.onBlur}
            ></combobox-input>
            ${this.isFocused ? html`<options-list
                class="options"
                .options=${this.options}
                .filterValue=${this.filterValue}
                @option-click=${this.onOptionClick}
                @blur=${this.onBlur}
                style="max-height: ${this.maxHeight}px"
            ></options-list>` : null}
            <slot hidden></slot>
        `;
    }
}
