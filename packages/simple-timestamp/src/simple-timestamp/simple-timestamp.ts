import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    formatTime,
    formatShortDate,
    formatRelativeDate
} from '../utils';

@customElement('simple-timestamp')
export class SimpleTimestamp extends LitElement {
    static styles = css`
        :host {
            cursor: pointer;
            user-select: none;
        }

        .error-text {
            text-decoration: underline wavy red;
        }
    `;

    static formats  = {
        relative: 0,
        time: 1,
        short: 2
    } as const;

    @property({ type: String })
    value: string = '';

    @property({ type: String })
    locale = navigator.language;

    @property({ type: String })
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    @property({ type: String })
    label = '';

    private currentFormatIndex = 0;

    private formattedDate = (): string => {
        const dateValue = new Date(this.value);

        switch (this.currentFormatIndex) {
            case SimpleTimestamp.formats.time:
                return formatTime(dateValue, this.locale, this.timezone);
    
            case  SimpleTimestamp.formats.short:
                return formatShortDate(dateValue, this.locale, this.timezone);
    
            default:
                return formatRelativeDate(dateValue, this.locale);
        }
    };

    // Add a click event listener to toggle the date format
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', () => {
            this.currentFormatIndex = 
                (this.currentFormatIndex + 1) %  Object.keys(SimpleTimestamp.formats).length;
            this.requestUpdate();
        });
    }
    
    render() {
        const prefix = this.label ? ': ' : '';

        if (!this.value) {
            throw new Error('The "value" attribute must be provided.');
        }

        try {
            return html`<div title="${this.value}">${this.label}${prefix}${this.formattedDate()}</div>`;
        }
        catch (error) {
            // Handle the parse error by displaying the value text content with wavy red underline
            return html`<div title="${this.value}"><span class="error-text">${this.value}</span></div>`;
        }
    }
}
