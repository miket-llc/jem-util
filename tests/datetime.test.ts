import {
  formatDate,
  addDaysToDate,
  subtractDaysFromDate,
  differenceInDaysBetweenDates,
  getCurrentDate
} from '../src/datetime'

describe('datetime utility functions', () => {
  test('formatDate formats date correctly', () => {
    const date = new Date(2023, 0, 1)
    const formattedDate = formatDate(date, 'yyyy-MM-dd')
    expect(formattedDate).toBe('2023-01-01')
  })

  test('addDaysToDate adds days correctly', () => {
    const date = new Date(2023, 0, 1)
    const newDate = addDaysToDate(date, 5)
    expect(newDate).toEqual(new Date(2023, 0, 6))
  })

  test('subtractDaysFromDate subtracts days correctly', () => {
    const date = new Date(2023, 0, 10)
    const newDate = subtractDaysFromDate(date, 5)
    expect(newDate).toEqual(new Date(2023, 0, 5))
  })

  test('differenceInDaysBetweenDates calculates difference correctly', () => {
    const date1 = new Date(2023, 1, 10)
    const date2 = new Date(2023, 1, 1)
    const difference = differenceInDaysBetweenDates(date1, date2)
    expect(difference).toBe(9)
  })

  test('getCurrentDate returns current date', () => {
    const currentDate = getCurrentDate()
    const now = new Date()
    expect(currentDate.toDateString()).toBe(now.toDateString())
  })
})
