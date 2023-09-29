import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ComboboxKeyboardController } from '../controllers';
import { ComboboxMixin } from '../mixins';
import "@oddbird/popover-polyfill";

// @ts-ignore
import popoverPolyfill from "@oddbird/popover-polyfill/dist/popover.css?inline";
import { styles } from './autocomplete-combobox.css';

export type Option = {
    value: string; 
    label: string;
    disabled?: boolean;
}

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends ComboboxMixin(LitElement) {
    static styles = [
        ...[super.styles || []], 
        unsafeCSS(popoverPolyfill), 
        styles
    ];

    protected keyboardController = new ComboboxKeyboardController(this);

    @query('slot') private slotElement!: HTMLSlotElement;
    @query('[popover]') private popoverElement!: HTMLElement;

    private _value = '';
    private _options: Record<string, Option> = {};

    @state() filterValue = '';

    @property({ type: String })
    set value(newValue: string) {
        if (!newValue) {
            this.filterValue = '';
            this._value = '';
            return;
        }

        const option = this._options[newValue];
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

    @property({ type: Array })
    set options(newOptions: Option[]) {
        this._options = newOptions.reduce((acc, option) => {
            if (acc.hasOwnProperty(option.value)) {
                console.warn(`Option with value "${option.value}" already exists.`);
            } else {
                acc[option.value] = option;
            }
            return acc;
        }, {} as Record<string, Option>);
    
        this.requestUpdate("options");
    }

    get options() {
        return Object.values(this._options);
    }

    firstUpdated() {
        if (this.options.length === 0) {
            this.slotElement.addEventListener('slotchange', () => {
                const optionElements = this.slotElement.assignedNodes().filter((node) =>
                    node instanceof HTMLOptionElement
                ) as HTMLOptionElement[];
    
                this.options = optionElements.map((element) => ({
                    value: element.value,
                    label: element.label,
                    disabled: element.disabled,
                }));

                const selectedOption = optionElements.find((element) => element.selected);
                if (selectedOption) {
                    this.value = selectedOption.value;
                }
            });
        }
    }

    onFocus(e: FocusEvent) {
        this.ariaExpanded = "true";
        this.popoverElement.showPopover();
        this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    }

    onBlur(e: FocusEvent) {
        this.ariaExpanded = "false";
        this.popoverElement.hidePopover();
        this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
        this.requestUpdate("ariaExpanded");
    }

    onInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        this.filterValue = inputElement.value;
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    onOptionClick(value: string) {
        const option = this._options[value];
        if (option && !option.disabled) {
            this.value = value;
        }
    }

    render() {
        return html`
            ${this.renderInput("options")}
            <ul 
                popover="manual"
                id="options"
                role="listbox"
                part="listbox"
            >
                ${this.options
                    .filter(({label}) =>
                        label
                            .toLowerCase()
                            .includes(this.filterValue.toLowerCase())
                    )
                    .map(({label, value, disabled}) => 
                        html`
                            <li
                                part="option"
                                role="option"
                                id=${value}
                                ?disabled=${disabled}
                                @mousedown=${(e: Event) => {
                                    disabled && e.preventDefault()
                                    this.onOptionClick(value)
                                }}
                            >${label}</li>
                        `
                    )
                }
            </ul>
            <slot hidden></slot>
        `;
    }
}
