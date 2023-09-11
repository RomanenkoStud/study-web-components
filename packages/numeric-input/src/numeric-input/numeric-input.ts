import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from './numeric-input.css';

@customElement('numeric-input')
export class NumericInput extends LitElement {
    @property({ type: String }) lang = navigator.language;
    @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;
    @property({ type: Boolean, attribute: 'no-spinner' }) noSpinner = false;
    private ATTR = 'raw';

    private get formatter() {
        const fmt = new Intl.NumberFormat(this.lang, this.formatOptions);
        return (num: number) =>
            typeof num !== 'number' || isNaN(num) ? '' : fmt.format(num);
    }

    private onFocus(e: Event): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement.type === 'text') {
            const old = inputElement.dataset[this.ATTR] || '';
            delete inputElement.dataset[this.ATTR];
            inputElement.type = 'number';
            inputElement.value = old;
        }
    }

    private onBlur(e: Event): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement.type === 'number') {
            inputElement.type = 'text';
            const raw = inputElement.value;
            inputElement.dataset[this.ATTR] = raw;
            const rawNumber = Number.parseFloat(raw);
            if (!isNaN(rawNumber)) {
                const formatted = this.formatter(rawNumber);
                inputElement.value = formatted;
                inputElement.setCustomValidity('');
            } else {
                inputElement.value = '';
                if (raw) {
                    inputElement.setCustomValidity('Not a number');
                }
            }
        }
    }

    static styles = styles;

    render() {
        return html`
            <input
                type="number"
                inputmode="numeric"
                class=${this.noSpinner ? 'no-spinner' : ''}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
            />
        `;
    }
}
