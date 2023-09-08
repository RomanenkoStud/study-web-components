import { describe, it, expect } from 'vitest';
import { formatShortDate } from './formatShortDate';

describe('formatShortDate', () => {
    it('formats a short date with the year', () => {
        // A date in a different year (2022)
        const date = new Date('2022-03-29T14:30:00Z');
        const locale = 'en-US';
        const timezone = 'UTC';
    
        // Expect the date format 'Mar 29, 22'
        expect(formatShortDate(date, locale, timezone)).toBe('Mar 29, 22');
    });

    it('formats a short date without the year', () => {
        // A date in the current year
        const date = new Date();
        const locale = 'en-US';
        const timezone = 'UTC';
    
        // Format the current date without the year
        const formattedDate = formatShortDate(date, locale, timezone);
    
        // Expect the formatted date to not contain a comma (year)
        expect(formattedDate.includes(',')).toBe(false);
    });

    it('formats a short date with a different locale', () => {
        const date = new Date('2022-03-29T14:30:00Z');
        const locale = 'fr-FR'; // French locale
        const timezone = 'UTC';
    
        // Expect the date format '29 mars 23'
        expect(formatShortDate(date, locale, timezone)).toBe('29 mars 22');
    });

    it('formats a short date in a different timezone', () => {
        const date = new Date('2022-03-29T14:30:00Z');
        const locale = 'en-US';
        const timezone = 'America/New_York'; // Eastern Time
    
        // Expect the date format 'Mar 29, 23'
        expect(formatShortDate(date, locale, timezone)).toBe('Mar 29, 22');
    });

    it('formats a short date in a different timezone with boundary value', () => {
        // A date string in UTC representing March 29, 2022
        const date = new Date('2022-03-29T03:30:00Z');
        const locale = 'en-US';
        const timezone = 'America/New_York'; // Eastern Time (which is 4 hours behind UTC)
    
        // The expected result should be March 28, 2022
        expect(formatShortDate(date, locale, timezone)).toBe('Mar 28, 22');
    });
});
