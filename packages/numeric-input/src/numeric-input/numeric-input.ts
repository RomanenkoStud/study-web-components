import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormInputMixin } from '../mixins';

import { styles } from './numeric-input.css';

@customElement('numeric-input')
export class NumericInput extends FormInputMixin(LitElement) {
    @property({ type: String }) lang = navigator.language;
    @property({ type: Object }) formatOptions?: Intl.NumberFormatOptions;

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

    onFocus(): void {
        super.onFocus();
        this.inputElement.type = 'number';
        this.inputElement.value = this.value;
    }

    onBlur(): void {
        super.onBlur();
        this.inputElement.type = 'text';
        this.value = this.inputElement.value;
        this.inputElement.value = this.format(this.value);
    }

    formResetCallback() {
        this.value = '';
        this.inputElement.value = '';
    }

    formStateRestoreCallback(state: string, mode: string) {
        this.value = state;
        this.inputElement.value = this.format(state);
    }

    onInput() {
        super.onInput();
        this.value = this.inputElement.valueAsDate?.toISOString() ?? '';
    }

    static styles = [
        ...[super.styles ?? []],
        styles,
    ];

    render() {
        return html`
            <input
                value=${this.format(this.value)}
                type="text"
                inputmode="numeric"
                @input=${this.onInput}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
                autocomplete="off"
                part="input"
                .placeholder=${this.placeholder}
                ?disabled=${this.disabled}
            />
        `;
    }
}
