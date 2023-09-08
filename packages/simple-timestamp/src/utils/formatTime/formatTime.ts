export function formatTime(value: Date, locale: string, timezone: string): string {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(value);
}
