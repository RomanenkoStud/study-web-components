import { LitElement, html, css } from 'lit-element';
import { customElement } from 'lit/decorators.js';
import { FormInputMixin } from '../mixins';

@customElement('date-input')
export class DateInput extends FormInputMixin(LitElement) {
    static styles = [
        ...[super.styles ?? []],
        css`
            :host {
                --date-icon-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="black" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
            }
            input::-webkit-calendar-picker-indicator {
                background-image: var(--date-icon-image);
            }
        `
    ]

    private valueAsDate: Date | null = null;

    formResetCallback() {
        this.value = '';
        this.inputElement.value = '';
    }

    formStateRestoreCallback(state: string, mode: string) {
        this.valueAsDate = new Date(state);
    }

    onInput() {
        super.onInput();
        this.value = this.inputElement.valueAsDate?.toISOString() ?? '';
    }

    render() {
        return html`
            <input
                type="date"
                .valueAsDate=${this.valueAsDate}
                @input=${this.onInput}
                part="input"
            />
        `;
    }
}
