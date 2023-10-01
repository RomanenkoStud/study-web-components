import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query, queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ComboboxKeyboardController } from '../controllers';
import { ComboboxMixin, SrcOptionsMixin } from '../mixins';
import "@oddbird/popover-polyfill";

// @ts-ignore
import popoverPolyfill from "@oddbird/popover-polyfill/dist/popover.css?inline";
import { styles } from './autocomplete-combobox.css';

export interface OptionElement extends HTMLElement {
    // element.scrollintoviewifneeded-polyfill
    scrollIntoViewIfNeeded: () => void;
};

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends SrcOptionsMixin(ComboboxMixin(LitElement)) {
    static styles = [
        ...[super.styles ?? []], 
        unsafeCSS(popoverPolyfill), 
        styles
    ];

    protected keyboardController = new ComboboxKeyboardController(this);

    @query('slot') slotElement!: HTMLSlotElement;
    @query('ul') listboxElement!: HTMLElement;
    @queryAll('li') optionElements!: NodeListOf<OptionElement>;

    private _value = '';

    @state() filterValue = '';

    @property({ type: String })
    set value(newValue: string) {
        if (!newValue) {
            this.filterValue = '';
            this._value = '';
            return;
        }

        const option = this.getOption(newValue);
        if (option) {
            this.filterValue = option.label;
            this._value = newValue;
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } else {
            console.warn(`Option with value "${newValue}" does not exist.`);
        }

        this.comboboxElement.value = this.filterValue;
    }

    get value() {
        return this._value;
    }

    firstUpdated() {
        if (this.options.length === 0) {
            this.slotElement.addEventListener('slotchange', () => {
                const optionElements = this.slotElement.assignedNodes().filter((node) =>
                    node instanceof HTMLOptionElement
                ) as HTMLOptionElement[];
    
                this.options = optionElements.map(({
                    label, value, disabled, title
                }) => ({
                    label, value, disabled, title
                }));

                const selectedOption = optionElements.find((element) => element.selected);
                if (selectedOption) {
                    this.value = selectedOption.value;
                }
            });
        }
    }

    showOptions() {
        this.ariaExpanded = "true";
        this.listboxElement.showPopover();
    }

    hideOptions() {
        this.ariaExpanded = "false";
        this.listboxElement.hidePopover();
    }

    onFocus(e: FocusEvent) {
        this.showOptions();
        this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    }

    onBlur(e: FocusEvent) {
        this.hideOptions();
        this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
        this.requestUpdate("ariaExpanded");
    }

    onInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        this.filterValue = inputElement.value;
        this.debounceInput();
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    onOptionClick(value: string) {
        const option = this.getOption(value);
        if (option && !option.disabled) {
            this.value = value;
        }
    }

    constructor() {
        super();
        this.ariaAutoComplete = "list";
        this.ariaHasPopup = "listbox";
    }

    render() {
        return html`
            ${this.renderInput("options")}
            <ul 
                popover="manual"
                id="options"
                part="listbox"
            >
                ${this.options
                    .filter(({label}) =>
                        label
                            .toLowerCase()
                            .includes(this.filterValue.toLowerCase())
                    )
                    .map(({
                        label, 
                        value, 
                        disabled, 
                        htmlElement, 
                        title
                    }) => 
                        html`
                            <li
                                part="option"
                                id=${value}
                                ?disabled=${disabled}
                                @mousedown=${(e: Event) => {
                                    disabled && e.preventDefault()
                                    this.onOptionClick(value)
                                }}
                                title=${ifDefined(title)}
                            >${htmlElement ?? label}</li>
                        `
                    )
                }
            </ul>
            <slot hidden></slot>
        `;
    }
}
