import { LitElement, html } from 'lit-element';
import { customElement } from 'lit/decorators.js';

export type DateInputElement = Omit<HTMLInputElement, 'value' | 'type'> & {
    value: Date;
};

@customElement('date-input')
export class DateInput extends LitElement {
    private value: Date | null = null;

    private onInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.value = inputElement.valueAsDate;
    }

    render() {
        return html`
            <input
                id="date-input"
                type="date"
                .valueAsDate=${this.value}
                @input=${this.onInput}
            />
        `;
    }
}
