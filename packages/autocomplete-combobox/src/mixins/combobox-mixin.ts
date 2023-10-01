import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { property, query, queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Option } from '../types';

// @ts-ignore
import popoverPolyfill from "@oddbird/popover-polyfill/dist/popover.css?inline";
import { styles } from './combobox.css';

type Constructor<T> = new (...args: any[]) => T;

export interface OptionElement extends HTMLElement {
    // element.scrollintoviewifneeded-polyfill
    scrollIntoViewIfNeeded: () => void;
};

export declare class ComboboxInterface {
    disabled: boolean;
    required: boolean;
    placeholder: string;
    value: string;
    comboboxElement: HTMLInputElement;
    listboxElement: HTMLElement;
    optionElements: NodeListOf<OptionElement>;
    options: Option[];
    onChange(): void;
    onBlur(): void;
    onFocus(): void;
    onInput(): void;
    showOptions(): void;
    hideOptions(): void;
    getOption(value: string): Option;
    renderOption(option: Option): TemplateResult; 
    renderListbox(listboxId: string): TemplateResult;
}

export const ComboboxMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class ComboboxElement extends superClass {
        static formAssociated = true;

        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            unsafeCSS(popoverPolyfill), 
            styles,
        ];

        @query('input') comboboxElement!: HTMLInputElement;
        @query('slot') slotElement!: HTMLSlotElement;
        @query('ul') listboxElement!: HTMLElement;
        @queryAll('li') optionElements!: NodeListOf<OptionElement>;

        @property({ type: Boolean, reflect: true }) disabled!: boolean;
        @property({ type: Boolean, reflect: true }) required!: boolean;
        @property({ type: String, reflect: true }) placeholder = '';
        @property({ type: String, reflect: true }) name = '';

        private _internals!: ElementInternals;
        private _options: Record<string, Option> = {};
        private _value = '';

        @property({ type: String })
        set value(newValue: string) {
            if (!newValue) {
                this._value = '';
                return;
            }

            const option = this.getOption(newValue);

            if (option) {
                this._value = newValue;
                this.onChange();
            } else {
                console.warn(`Option with value "${newValue}" does not exist.`);
            }

            this.comboboxElement.value = option.label;
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
        }

        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('focusin', this.focusInput);
            this.addEventListener('focusout', this.blurInput);
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener('focusin', this.focusInput);
            this.removeEventListener('focusout', this.blurInput);
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
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }

        focusInput() {
            this.comboboxElement.focus(); 
            this.tabIndex = -1;
        }

        blurInput() {
            this.tabIndex = 0;
        }

        checkValidity(): boolean {
            return this._internals.checkValidity();
        }

        get form(): HTMLFormElement | null {
            return this._internals.form;
        }

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

        updated(): void {
            this._internals.setValidity({ 
                valueMissing: this.required && this.comboboxElement.value.trim() === '',
            }, 'Invalid input.');
        }

        onOptionClick(value: string) {
            const option = this.getOption(value);
            if (option && !option.disabled) {
                this.value = value;
            }
        }

        renderOption(option: Option) {
            return html`
                <li
                    part="option"
                    id=${option.value}
                    ?disabled=${option.disabled}
                    @mousedown=${(e: Event) => {
                        option.disabled && e.preventDefault()
                        this.onOptionClick(option.value)
                    }}
                    title=${ifDefined(option.title)}
                >${option.htmlElement ?? option.label}</li>
            `;
        }


        renderListbox(listboxId: string) {
            return html`
                <ul 
                    popover="manual"
                    id=${listboxId}
                    part="listbox"
                >
                    ${this.options.map((option) => this.renderOption(option))
                    }
                </ul>
            `;
        }

        render() {
            return html`
                <input
                    part="combobox"
                    type="text"
                    @input=${this.onInput}
                    @focus=${this.onFocus}
                    @blur=${this.onBlur}
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

    return ComboboxElement as Constructor<ComboboxInterface> & T;
};