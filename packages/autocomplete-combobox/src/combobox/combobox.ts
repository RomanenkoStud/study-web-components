import { LitElement, html, unsafeCSS } from 'lit';
import { property, query, queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {cache} from 'lit/directives/cache.js';
import { Option } from '../types';
import { AnchorController } from '../controllers';

// @ts-ignore
import popoverPolyfill from "@oddbird/popover-polyfill/dist/popover.css?inline";
import { styles } from './combobox.css';

export interface OptionElement extends HTMLElement {
    // element.scrollintoviewifneeded-polyfill
    scrollIntoViewIfNeeded: () => void;
};

export class ComboboxElement extends LitElement {
    static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};

    static formAssociated = true;

    static styles = [
        ...[super.styles ?? []],
        unsafeCSS(popoverPolyfill), 
        styles,
    ];

    @query('input') inputElement!: HTMLInputElement;
    @query('slot') slotElement!: HTMLSlotElement;
    @query('ul') listboxElement!: HTMLElement;
    @queryAll('li') optionElements!: NodeListOf<OptionElement>;

    @property({ type: Boolean, reflect: true }) disabled!: boolean;
    @property({ type: Boolean, reflect: true }) required!: boolean;
    @property({ type: String, reflect: true }) placeholder = '';

    private _internals!: ElementInternals;
    private _options: Record<string, Option> = {};
    private _value = '';
    protected anchorController!: AnchorController;

    @property({ type: String })
    set value(newValue: string) {
        if (!newValue) {
            this._value = '';
            this.inputElement.value = '';
            this.onChange();
            return;
        }

        const option = this.getOption(newValue);

        if (option) {
            if (!option.disabled) {
                this._value = newValue;
                this.inputElement.value = option.label;
            } else {
                this._value = '';
                console.warn(`Option with value "${newValue}" is disabled.`);  
            }
        } else {
            this._value = '';
            console.warn(`Option with value "${newValue}" does not exist.`);
        }

        this.onChange();
    }

    get value() {
        return this._value;
    }

    @property({ type: Array })
    set options(newOptions: Option[]) {
        this._options = newOptions.reduce((acc, option) => {
            if (option.value === undefined || option.label === undefined) {
                console.warn(`Option with invalid structure: ${JSON.stringify(option)}`);
            } else if (acc.hasOwnProperty(option.value)) {
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

    showOptions() {
        this.ariaExpanded = "true";
        this.listboxElement.showPopover();
    }

    hideOptions() {
        this.ariaExpanded = "false";
        this.listboxElement.hidePopover();
    }

    getOption(value: string): Option {
        return this._options[value];
    }

    constructor(...params: any) {
        super();
        this._internals = this.attachInternals();
        this.role = "combobox";
        this.tabIndex = 0;
        this.ariaAutoComplete = "list";
        this.ariaHasPopup = "listbox";

        if (!CSS.supports('anchor-name', '--combobox')) {
            // The anchor-name property is not supported
            this.anchorController = new AnchorController(this)
        }
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

    onChange() {
        this._internals.setValidity({ 
            valueMissing: this.required && this.value.trim() === '',
        }, 'Invalid input.');
        this._internals.setFormValue(this.value);
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }

    get form() { return this._internals.form; }
    get name() { return this.getAttribute('name'); }
    get type() { return this.localName; }
    get validity() { return this._internals.validity; }
    get validationMessage() { return this._internals.validationMessage; }
    get willValidate() { return this._internals.willValidate; }

    formAssociatedCallback(nullableForm: HTMLFormElement | null) {
        this._internals.setValidity({ 
            valueMissing: this.required && this.value.trim() === '',
        }, 'Invalid input.');
        this._internals.setFormValue(this.value);
        return;
    }

    formResetCallback() {
        this.value = '';
    }

    formStateRestoreCallback(state: string, mode: string) {
        this.value = state;
    }

    reportValidity(): boolean { return this._internals.reportValidity(); }
    checkValidity(): boolean { return this._internals.checkValidity(); }

    onFocus() {
        this.showOptions();
        this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    }

    onBlur() {
        this.hideOptions();
        this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    }

    onInput() {
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    onOptionClick(value: string) {
        const option = this.getOption(value);
        if (option && !option.disabled) {
            this.value = value;
        }
    }

    renderOptionsList(options: Option[]) {
        return html`${cache(options.map((option) => (html`
            <li
                part=${`option ${option.disabled ? 'option-disabled' : ''}`}
                id=${option.value}
                ?disabled=${option.disabled}
                @mousedown=${(e: Event) => {
                    option.disabled && e.preventDefault()
                    this.onOptionClick(option.value)
                }}
                title=${ifDefined(option.title)}
            >${option.htmlElement ?? option.label}</li>
            `)))
        }`
    }


    renderListbox(listboxId: string) {
        return html`
            <ul 
                popover="manual"
                id=${listboxId}
                part="listbox"
            >
                ${this.renderOptionsList(this.options)}
            </ul>
        `;
    }

    render() {
        return html`
            <input
                part="input"
                type="text"
                @input=${this.onInput}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
                @change=${() => {
                    this.value = this.inputElement.value;
                }}
                .placeholder=${this.placeholder}
                ?disabled=${this.disabled}
                popovertarget="options"
                autocomplete="off"
            />
            ${this.renderListbox("options")}
            <slot hidden></slot>
        `;
    }
}