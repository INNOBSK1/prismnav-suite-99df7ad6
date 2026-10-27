import { describe, expect, it } from 'bun:test';
import { canCreateAccount } from './signup-agreement';

describe('signup requires reading and accepting the policies', () => {
  it('blocks signup until both requirements are met', () => {
    expect(canCreateAccount(false, false)).toBe(false);
    expect(canCreateAccount(false, true)).toBe(false);
    expect(canCreateAccount(true, false)).toBe(false);
    expect(canCreateAccount(true, true)).toBe(true);
  });
});