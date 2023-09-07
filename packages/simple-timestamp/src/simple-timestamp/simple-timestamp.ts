import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('simple-timestamp')
export class SimpleTimestamp extends LitElement {
    static styles = css`
        :host {
            cursor: pointer;
            user-select: none;
        }
    `;

    static formats  = {
        relative: 0,
        long: 1,
        short: 2
    } as const;

    @property({ converter: {
        toAttribute(value: Date): string {
            return value.toISOString();
        },
        fromAttribute(value: string | null): Date {
            return new Date(value ?? '');
        }
    }})
    value: Date = new Date();

    @property({ type: String })
    locale = navigator.language;

    @property({ type: String })
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    @property({ type: String })
    label = '';

    private currentFormatIndex = 0;

    private formattedDate = (): string => {
        switch (this.currentFormatIndex) {
            case SimpleTimestamp.formats.long:
                return new Intl.DateTimeFormat(this.locale, {
                    timeZone: this.timezone,
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }).format(this.value);
    
            case  SimpleTimestamp.formats.short:
                const currentYear = new Date().getFullYear();
                const options: Intl.DateTimeFormatOptions = {
                    timeZone: this.timezone,
                    day: 'numeric',
                    month: 'short',
                    year: this.value.getFullYear() !== currentYear ? '2-digit' : undefined,
                };
                
                return new Intl.DateTimeFormat(this.locale, options).format(this.value);
    
            default:
                const diffInMilliseconds = this.value.getTime() - Date.now();
                
                return new Intl.RelativeTimeFormat(this.locale).format(
                    Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)),
                    'day'
                );
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

        return html`<div>${this.label}${prefix}${this.formattedDate()}</div>`;
    }
}
