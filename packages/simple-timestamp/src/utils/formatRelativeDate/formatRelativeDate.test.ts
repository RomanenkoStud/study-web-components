import { describe, it, expect } from 'vitest';
import { formatRelativeDate } from './formatRelativeDate';

describe('formatRelativeDate', () => {
    it('formats a date less than a minute ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 3000); // 3 seconds ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('3 seconds ago');
    });

    it('formats a date less than an hour ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('30 minutes ago');
    });

    it('formats a date less than a day ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 12 * 3600 * 1000); // 12 hours ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('12 hours ago');
    });

    it('formats a date less than a month ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 15 * 24 * 3600 * 1000); // 15 days ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('15 days ago');
    });

    it('formats a date less than a year ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 180 * 24 * 3600 * 1000); // 180 days ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('6 months ago');
    });

    it('formats a date a year ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 400 * 24 * 3600 * 1000); // 400 days ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('last year');
    });

    it('formats a date more than a year ago', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 800 * 24 * 3600 * 1000); // 800 days ago
        const locale = 'en-US';

        expect(formatRelativeDate(date, locale)).toBe('2 years ago');
    });
});
