import { describe, expect, it } from 'vitest'

import { fileName, formatDate } from '../signature-upload.helpers'

describe('signature-upload.helpers', () => {
  describe('fileName', () => {
    it('should return the file name from the path', () => {
      const path = '/path/to/file.txt'
      const result = fileName(path)

      expect(result).toBe('file.txt')
    })

    it('should return the last part of the path as the file name', () => {
      const path = '/path/to/another/file.pdf'
      const result = fileName(path)

      expect(result).toBe('file.pdf')
    })
  })

  describe('formatDate', () => {
    it('should format the date correctly', () => {
      const date = '2025-03-27T12:00:00Z'
      const result = formatDate(date)

      expect(result).toBe('03/27/25, 09:00 AM')
    })

    it('should handle invalid date input gracefully', () => {
      const date = 'invalid-date'
      const result = formatDate(date)

      expect(result).toBe('Invalid Date')
    })
  })
})
