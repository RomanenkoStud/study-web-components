import memoizeFormatConstructor from 'intl-format-cache';

const memoizedDateTimeFormat = memoizeFormatConstructor(Intl.DateTimeFormat);

export function formatTime(value: Date, locale: string, timezone: string): string {
    const formatter = memoizedDateTimeFormat(locale, {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    return formatter.format(value);
}
