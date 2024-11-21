import { format, parse, addDays, subDays, differenceInDays } from 'date-fns'
// Removed parseWithFormat import as it is not needed

/**
 * Formats a date object into a string.
 * @param date - The date object to format.
 * @param dateFormat - The format string.
 * @returns The formatted date string.
 */
export function formatDate(date: Date, dateFormat: string): string {
  return format(date, dateFormat)
}

/**
 * Adds days to a date.
 * @param date - The date object.
 * @param days - The number of days to add.
 * @returns The new date object.
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days)
}

/**
 * Subtracts days from a date.
 * @param date - The date object.
 * @param days - The number of days to subtract.
 * @returns The new date object.
 */
export function subtractDaysFromDate(date: Date, days: number): Date {
  return subDays(date, days)
}

/**
 * Calculates the difference in days between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns The difference in days.
 */
export function differenceInDaysBetweenDates(date1: Date, date2: Date): number {
  return differenceInDays(date1, date2)
}

/**
 * Gets the current date.
 * @returns The current date.
 */
export function getCurrentDate(): Date {
  return new Date()
}
