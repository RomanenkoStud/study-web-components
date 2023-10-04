import { LitElement, css } from 'lit';
import { property, query } from 'lit/decorators.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class FormInputInterface {
    get form(): HTMLFormElement | null;
    get name(): string | null;
    get type(): string;
    get validity(): ValidityState;
    get validationMessage(): string;
    get willValidate(): boolean;
    reportValidity(): boolean;
    checkValidity(): boolean;
    onChange(): void;
    onInput(): void;
    onBlur(): void;
    onFocus(): void;
    inputElement: HTMLInputElement;
    set value(newValue: string);
    get value(): string;
    disabled: boolean | undefined;
    required: boolean | undefined;
    placeholder: string;
    formAssociatedCallback(nullableForm: HTMLFormElement | null): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string, mode: string): void;
    setValidity(flags?: ValidityStateFlags | undefined, message?: string | undefined, anchor?: HTMLElement | undefined): void;
    setFormValue(value: string | File | FormData | null, state?: string | File | FormData | null | undefined): void;
    validate(): void;
}

export const FormInputMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class FormInputElement extends superClass {
        static formAssociated = true;
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []],
            css`
                :host {
                    display: inline-block;
                    width: 150px;
                }
                input {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                }
            `
        ]

        private _value = '';
        private _internals!: ElementInternals;

        @query('input') inputElement!: HTMLInputElement;
        @property({ type: Boolean, reflect: true }) disabled!: boolean;
        @property({ type: Boolean, reflect: true }) required!: boolean;
        @property({ type: String, reflect: true }) placeholder = '';

        @property({ type: String })
        set value(newValue: string) {
            this._value = newValue;
            this.onChange();
        }

        get value() {
            return this._value;
        }

        constructor(...params: any) {
            super();
            this._internals = this.attachInternals();
            this.tabIndex = 0;
        }

        onChange() {
            this.validate();
            this.setFormValue(this.value, this.value);
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }

        setValidity(flags?: ValidityStateFlags | undefined, message?: string | undefined, anchor?: HTMLElement | undefined) {
            this._internals.setValidity(flags, message, anchor);
        }

        setFormValue(value: string | File | FormData | null, state?: string | File | FormData | null | undefined) {
            this._internals.setFormValue(value, state);
        }

        get form() { return this._internals.form; }
        get name() { return this.getAttribute('name'); }
        get type() { return this.localName; }
        get validity() { return this._internals.validity; }
        get validationMessage() { return this._internals.validationMessage; }
        get willValidate() { return this._internals.willValidate; }

        validate() {
            this.setValidity({ 
                valueMissing: this.required && this.value.trim() === '',
            }, 'Value is required');
        }

        formAssociatedCallback(nullableForm: HTMLFormElement | null) {
            this.validate();
            this.setFormValue(this.value, this.value);
        }
    
        formResetCallback() {
            this.value = '';
            this.inputElement.value = '';
        }
    
        formStateRestoreCallback(state: string, mode: string) {
            this.value = state;
        }
    
        reportValidity(): boolean { return this._internals.reportValidity(); }
        checkValidity(): boolean { return this._internals.checkValidity(); }
    
        onFocus() {
            this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
        }
    
        onBlur() {
            this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
        }
    
        onInput() {
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }

        focusInput() {
            this.inputElement.focus(); 
            this.tabIndex = -1;
        }
    
        blurInput() {
            this.tabIndex = 0;
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
    }

    return FormInputElement as Constructor<FormInputInterface> & T;
};