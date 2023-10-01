import { LitElement, html, css, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class ComboboxInterface {
    disabled: boolean;
    required: boolean;
    placeholder: string;
    comboboxElement: HTMLInputElement;
    renderInput(listboxId: string): TemplateResult;
}

export const ComboboxMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class ComboboxElement extends superClass {
        static formAssociated = true;

        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            css`
                :host {
                    display: inline-block;
                    --text-color: #000;
                    --input-background: #fff;
                }
                @media (prefers-color-scheme: dark) {
                    :host {
                        --input-background: #444;
                        --text-color: #fff;
                    }
                }
                [part="combobox"] {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    background-color: var(--input-background);
                    color: var(--text-color);
                }
            `,
        ];

        @query('input') comboboxElement!: HTMLInputElement;

        @property({ type: Boolean, reflect: true }) disabled!: boolean;
        @property({ type: Boolean, reflect: true }) required!: boolean;
        @property({ type: String, reflect: true }) placeholder = '';
        @property({ type: String, reflect: true }) name = '';

        private _internals!: ElementInternals;

        constructor(...params: any) {
            super();
            this._internals = this.attachInternals();
            this.role = "combobox";
            this.tabIndex = 0;
        }

        connectedCallback() {
            super.connectedCallback();
            this.addEventListener('focusin', this.focus);
            this.addEventListener('focusout', this.blur);
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            this.removeEventListener('focusin', this.focus);
            this.removeEventListener('focusout', this.blur);
        }

        focus() {
            this.comboboxElement.focus(); 
            this.tabIndex = -1;
        }

        blur() {
            this.tabIndex = 0;
        }

        checkValidity(): boolean {
            return this._internals.checkValidity();
        }

        get form(): HTMLFormElement | null {
            return this._internals.form;
        }

        onFocus(e: FocusEvent) {
            this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
        }
    
        onBlur(e: FocusEvent) {
            this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
        }
    
        onInput(e: Event) {
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }

        updated(): void {
            this._internals.setValidity({ 
                valueMissing: this.required && this.comboboxElement.value.trim() === '',
            }, 'Invalid input.');
        }

        renderInput(listboxId: string) {
            return html`
                <input
                    part="combobox"
                    type="text"
                    @input=${this.onInput}
                    @focus=${this.onFocus}
                    @blur=${this.onBlur}
                    .placeholder=${this.placeholder}
                    ?disabled=${this.disabled}
                    popovertarget=${listboxId}
                    autocomplete="off"
                />
            `;
        }
    }

    return ComboboxElement as Constructor<ComboboxInterface> & T;
};