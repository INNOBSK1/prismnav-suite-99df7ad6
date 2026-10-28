import { describe, expect, it } from 'bun:test';
import { validRecoveryCode, validNewPassword } from './password-recovery';

describe('password recovery', () => {
  it('requires a numeric auth code before verification', () => {
    expect(validRecoveryCode('123456')).toBe(true);
    expect(validRecoveryCode('12345678')).toBe(true);
    expect(validRecoveryCode('12345')).toBe(false);
    expect(validRecoveryCode('abcdef')).toBe(false);
    expect(validRecoveryCode('')).toBe(false);
  });
  it('requires matching passwords within the existing account limits', () => {
    expect(validNewPassword('newpass1', 'newpass1')).toBe(true);
    expect(validNewPassword('short', 'short')).toBe(false);
    expect(validNewPassword('newpass1', 'different')).toBe(false);
    expect(validNewPassword('a'.repeat(73), 'a'.repeat(73))).toBe(false);
  });
});