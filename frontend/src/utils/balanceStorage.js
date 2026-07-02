/**
 * balanceStorage.js
 * -----------------
 * Single source-of-truth for BTS balance reads and mutations.
 * Balance lives on `profile.balance` (integer BTS, e.g. 2450).
 *
 * All write operations:
 *   1. Merge into the profile object
 *   2. Persist via profileStorage.updateProfile (→ PUT /api/profile)
 *   3. Return { ok, newBalance, error } so callers can show inline feedback
 */
import { getProfile, updateProfile } from './profileStorage';

/** Return the current balance as a plain number (0 if unknown). */
export function getBalance() {
  return Number(getProfile().balance) || 0;
}

/**
 * Deduct `amount` BTS from the user's balance.
 * Returns { ok: true, newBalance } on success.
 * Returns { ok: false, error: string } when insufficient funds.
 *
 * @param {number} amount     Positive integer BTS to deduct.
 * @param {string} [reason]   Optional description for future audit use.
 */
export async function deductBalance(amount, reason = '') {
  const current = getBalance();
  if (current < amount) {
    return {
      ok: false,
      error: `Insufficient BTS balance. You have ${current.toLocaleString()} BTS but this costs ${amount.toLocaleString()} BTS.`,
      newBalance: current,
    };
  }
  const newBalance = current - amount;
  await updateProfile({ balance: newBalance });
  return { ok: true, newBalance };
}

/**
 * Credit `amount` BTS to the user's balance (refunds, payouts, etc.)
 * @param {number} amount
 */
export async function creditBalance(amount) {
  const current = getBalance();
  const newBalance = current + amount;
  await updateProfile({ balance: newBalance });
  return { ok: true, newBalance };
}

/**
 * Check affordability without mutating state.
 * @param {number} cost
 * @returns {{ affordable: boolean, balance: number, shortfall: number }}
 */
export function checkAffordability(cost) {
  const balance = getBalance();
  return {
    affordable: balance >= cost,
    balance,
    shortfall: Math.max(0, cost - balance),
  };
}
