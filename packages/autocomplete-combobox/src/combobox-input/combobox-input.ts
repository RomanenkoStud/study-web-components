import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './combobox-input.css';

@customElement('combobox-input')
export class ComboboxInput extends LitElement {
    static styles = styles;

    @property({ type: String }) value = '';

    onInput(e: Event) {
        const inputElement = e.target as HTMLInputElement;
        const newValue = inputElement.value;

        this.dispatchEvent(new CustomEvent('combobox-input', { detail: newValue }));
    }

    render() {
        return html`
            <input
                ariaHasPopup
                type="text"
                class="combobox"
                .value=${this.value}
                @input=${this.onInput}
            />
        `;
    }
}
