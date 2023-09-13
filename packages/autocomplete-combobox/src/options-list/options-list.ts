import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './options-list.css';

@customElement('options-list')
export class OptionsList extends LitElement {
    static styles = styles;

    @property({ type: Array }) options: string[] = [];
    @property({ type: String }) filterValue = '';

    onOptionClick(value: string) {
        this.dispatchEvent(new CustomEvent('option-click', { detail: value }));
    }

    render() {
        return html`
            <div class="options">
                ${this.options
                    .filter((value) =>
                        value
                            .toLowerCase()
                            .includes(this.filterValue.toLowerCase())
                    )
                    .map((value) => 
                        html`
                            <input
                                type="button"
                                class="option"
                                id=${value}
                                value=${value}
                                @click=${() => {
                                    this.onOptionClick(value)
                                }}
                            />
                        `
                    )
                }
            </div>
        `;
    }
}
