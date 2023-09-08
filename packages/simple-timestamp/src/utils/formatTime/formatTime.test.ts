import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
    it('formats a date in 12-hour format with AM/PM', () => {
        const date = new Date('2023-09-07T15:30:00Z');
        const locale = 'en-US';
        const timezone = 'UTC';
        const expected = '3:30 PM';

        expect(formatTime(date, locale, timezone)).toBe(expected);
    });

    it('formats a date in 12-hour format with AM/PM (different timezone)', () => {
        const date = new Date('2023-09-07T15:30:00Z');
        const locale = 'en-US';
        const timezone = 'America/New_York'; // Eastern Time
        const expected = '11:30 AM'; // Timezone conversion

        expect(formatTime(date, locale, timezone)).toBe(expected);
    });
});
