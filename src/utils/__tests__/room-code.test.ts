import { describe, it, expect, vi } from '@jest/globals';
import { generateRoomCode, validateRoomCode, formatRoomCode } from '../room-code';

describe('room-code', () => {
  describe('generateRoomCode', () => {
    it('should generate a 6-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
    });

    it('should generate codes with valid characters only', () => {
      const code = generateRoomCode();
      expect(code).toMatch(/^[A-Z2-9]+$/);
    });

    it('should not include confusing characters (0, O, I, 1)', () => {
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        expect(code).not.toMatch(/[0O1I]/);
      }
    });

    it('should generate different codes on multiple calls', () => {
      const codes = new Set();
      for (let i = 0; i < 50; i++) {
        codes.add(generateRoomCode());
      }
      // With 50 calls, we should get at least some unique codes
      expect(codes.size).toBeGreaterThan(1);
    });
  });

  describe('validateRoomCode', () => {
    it('should return true for valid 6-character codes', () => {
      expect(validateRoomCode('ABCDEF')).toBe(true);
      expect(validateRoomCode('234567')).toBe(true);
      expect(validateRoomCode('ABC234')).toBe(true);
    });

    it('should return false for codes with invalid length', () => {
      expect(validateRoomCode('ABCDE')).toBe(false); // Too short
      expect(validateRoomCode('ABCDEFG')).toBe(false); // Too long
      expect(validateRoomCode('')).toBe(false); // Empty
    });

    it('should return false for codes with invalid characters', () => {
      expect(validateRoomCode('ABCDE0')).toBe(false); // Contains 0
      expect(validateRoomCode('ABCDEO')).toBe(false); // Contains O
      expect(validateRoomCode('ABCDE1')).toBe(false); // Contains 1
      expect(validateRoomCode('ABCDEI')).toBe(false); // Contains I
      expect(validateRoomCode('abc123')).toBe(false); // Lowercase
      expect(validateRoomCode('ABC-DE')).toBe(false); // Special characters
    });
  });

  describe('formatRoomCode', () => {
    it('should format 6-character code as XXX-XXX', () => {
      expect(formatRoomCode('ABCDEF')).toBe('ABC-DEF');
      expect(formatRoomCode('234567')).toBe('234-567');
    });

    it('should return code as-is if not 6 characters', () => {
      expect(formatRoomCode('ABCDE')).toBe('ABCDE');
      expect(formatRoomCode('ABCDEFG')).toBe('ABCDEFG');
      expect(formatRoomCode('')).toBe('');
    });
  });
});

