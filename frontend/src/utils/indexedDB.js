/**
 * indexedDB.js  –  STUB (no longer used)
 * ========================================
 *
 * IndexedDB is no longer used as a storage layer.
 * Data is now fetched directly from the Flask REST API on page load.
 *
 * This stub preserves the exported function signatures so any remaining
 * imports compile without errors.
 */

export async function idbGet(_key)           { return null; }
export async function idbSet(_key, _value)   { /* no-op */ }
export async function idbDel(_key)           { /* no-op */ }
export async function idbGetAll()            { return {}; }
export async function idbSetMany(_entries)   { /* no-op */ }
export async function idbClear()             { /* no-op */ }

export default { version: () => ({ stores: () => {} }) };
