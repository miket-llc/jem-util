import {
  formatDate,
  addDaysToDate,
  subtractDaysFromDate,
  differenceInDaysBetweenDates,
  getCurrentDate
} from '../src/datetime'

describe('datetime utility functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2023, 0, 1)
      const formattedDate = formatDate(date, 'yyyy-MM-dd')
      expect(formattedDate).toBe('2023-01-01')
    })

    it('should handle different date formats', () => {
      const date = new Date(2023, 0, 1)
      const formattedDate = formatDate(date, 'MM/dd/yyyy')
      expect(formattedDate).toBe('01/01/2023')
    })
  })

  describe('addDaysToDate', () => {
    it('should add days correctly', () => {
      const date = new Date(2023, 0, 1)
      const newDate = addDaysToDate(date, 5)
      expect(newDate).toEqual(new Date(2023, 0, 6))
    })

    it('should handle negative days', () => {
      const date = new Date(2023, 0, 10)
      const newDate = addDaysToDate(date, -5)
      expect(newDate).toEqual(new Date(2023, 0, 5))
    })
  })

  describe('subtractDaysFromDate', () => {
    it('should subtract days correctly', () => {
      const date = new Date(2023, 0, 10)
      const newDate = subtractDaysFromDate(date, 5)
      expect(newDate).toEqual(new Date(2023, 0, 5))
    })

    it('should handle negative days', () => {
      const date = new Date(2023, 0, 1)
      const newDate = subtractDaysFromDate(date, -5)
      expect(newDate).toEqual(new Date(2023, 0, 6))
    })
  })

  describe('differenceInDaysBetweenDates', () => {
    it('should calculate difference correctly', () => {
      const date1 = new Date(2023, 1, 10)
      const date2 = new Date(2023, 1, 1)
      const difference = differenceInDaysBetweenDates(date1, date2)
      expect(difference).toBe(9)
    })

    it('should handle negative difference', () => {
      const date1 = new Date(2023, 1, 1)
      const date2 = new Date(2023, 1, 10)
      const difference = differenceInDaysBetweenDates(date1, date2)
      expect(difference).toBe(-9)
    })
  })

  describe('getCurrentDate', () => {
    it('should return current date', () => {
      const currentDate = getCurrentDate()
      const now = new Date()
      expect(currentDate.toDateString()).toBe(now.toDateString())
    })
  })
})
