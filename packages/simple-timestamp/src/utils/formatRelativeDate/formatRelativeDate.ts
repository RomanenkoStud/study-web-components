import memoizeFormatConstructor from 'intl-format-cache';

const memoizedRelativeTimeFormat = memoizeFormatConstructor(Intl.RelativeTimeFormat);

export function formatRelativeDate(value: Date, locale: string): string {
    const diffInMilliseconds = Date.now() - value.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const absoluteSeconds = Math.abs(diffInSeconds);

    const formatter = memoizedRelativeTimeFormat(locale, { numeric: 'auto' });

    const SECOND = 1;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    switch (true) {
        case absoluteSeconds < MINUTE:
            return formatter.format(-diffInSeconds, 'second');

        case absoluteSeconds < HOUR:
            const minutes = Math.floor(diffInSeconds / MINUTE);
            return formatter.format(-minutes, 'minute');

        case absoluteSeconds < DAY:
            const hours = Math.floor(diffInSeconds / HOUR);
            return formatter.format(-hours, 'hour');

        case absoluteSeconds < MONTH:
            const days = Math.floor(diffInSeconds / DAY);
            return formatter.format(-days, 'day');

        case absoluteSeconds < YEAR:
            const months = Math.floor(diffInSeconds / MONTH);
            return formatter.format(-months, 'month');

        default:
            const years = Math.floor(diffInSeconds / YEAR);
            return formatter.format(-years, 'year');
    }
}
