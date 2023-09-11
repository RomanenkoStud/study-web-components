export function formatDate(date: Date): string {
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
}
