import { LitElement, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

        :host([error])  {
            cursor: default;
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

    @property({ type: Boolean, reflect: true })
    error: boolean = false;

    @state()
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

    private toggleFormat() {
        if(this.error) {return;}

        this.currentFormatIndex = 
            (this.currentFormatIndex + 1) %  Object.keys(SimpleTimestamp.formats).length;
    }

    // Add a click event listener to toggle the date format
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.toggleFormat);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('click', this.toggleFormat);
    }
    
    render() {
        if (!this.value) {
            console.error('The "value" attribute must be provided.');
            return this.value;
        }

        try {
            this.error = false;
            return this.formattedDate();
        }
        catch (error) {
            console.error('Can not parse the value.');
            this.error = true;
            return this.value;
        }
    }
}
