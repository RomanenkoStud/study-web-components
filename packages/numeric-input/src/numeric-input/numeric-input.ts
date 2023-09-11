import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './numeric-input.css';

export type NumericInputElement = Omit<HTMLInputElement, 'type' | 'inputmode'> & {
    raw: string | null;
};

@customElement('numeric-input')
export class NumericInput extends LitElement {
    @property({ type: String }) lang = navigator.language;
    @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;
    @property({ type: Boolean, attribute: 'no-spinner' }) noSpinner = false;
    private _value: string = '';
    private _raw: string = '';

    @property({ type: String })
    get value(): string {
        return this._value;
    }

    set value(newValue: string) {
        const formatted = this.format(newValue);
        if (this._value !== formatted) {
            this._value = formatted;
            this._raw = newValue;
            this.requestUpdate('value');
        }
    }

    get raw(): string | null {
        return this._raw;
    }

    private get formatter() {
        const fmt = new Intl.NumberFormat(this.lang, this.formatOptions);
        return (num: number) =>
            typeof num !== 'number' || isNaN(num) ? '' : fmt.format(num);
    }

    private format(value: string): string {
        const rawNumber = Number.parseFloat(value);
        if (!isNaN(rawNumber)) {
            const formatted = this.formatter(rawNumber);
            return formatted;
        } else {
            return '';
        }
    }

    private onFocus(e: Event): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement.type === 'text') {
            const old = this._raw || '';
            this._raw = '';
            inputElement.type = 'number';
            inputElement.value = old;
        }
    }

    private onBlur(e: Event): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement.type === 'number') {
            inputElement.type = 'text';
            this._raw = inputElement.value;
            const rawNumber = Number.parseFloat(inputElement.value);
            if (!isNaN(rawNumber)) {
                this.value = inputElement.value;
                inputElement.setCustomValidity('');
            } else {
                this.value = '';
                if (inputElement.value) {
                    inputElement.setCustomValidity('Not a number');
                }
            }
            inputElement.value = this.value;

            const customEvent = new CustomEvent('format');
            this.dispatchEvent(customEvent);
        }
    }

    static styles = styles;

    render() {
        return html`
            <input
                type="text"
                inputmode="numeric"
                .value=${this.value}
                class=${this.noSpinner ? 'no-spinner' : ''}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
            />
        `;
    }
}
