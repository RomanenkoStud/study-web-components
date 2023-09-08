export function formatShortDate(value: Date, locale: string, timezone: string): string {
    const currentYear = new Date().getFullYear();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
        year: value.getFullYear() !== currentYear ? '2-digit' : undefined,
    };
    
    return new Intl.DateTimeFormat(locale, options).format(value);
}
