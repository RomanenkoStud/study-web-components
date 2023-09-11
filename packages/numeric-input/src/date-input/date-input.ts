import { LitElement, html } from 'lit-element';
import { customElement } from 'lit/decorators.js';

export type DateInputElement = HTMLElement & {
    value: Date;
};

@customElement('date-input')
export class DateInput extends LitElement {
    private value: Date | null = null;

    render() {
        return html`
            <input
                id="date-input"
                type="date"
                .valueAsDate=${this.value}
            />
        `;
    }
}
