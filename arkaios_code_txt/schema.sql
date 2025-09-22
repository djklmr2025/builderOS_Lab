-- schema.sql
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS accounts (
  account_id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,  -- el JSON firmado (version, owner, balances, meta, nonce, sig)
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  expires TEXT,          -- ISO8601 o NULL
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  used_at TEXT
);

CREATE TABLE IF NOT EXISTS ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  account_id TEXT NOT NULL,
  type TEXT NOT NULL,      -- 'credit' | 'debit' | 'redeem' | 'payment'
  amount INTEGER NOT NULL,
  meta_json TEXT
);

CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  provider TEXT NOT NULL,
  payload_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,           -- 'stripe' | 'bitso'
  provider_ref TEXT UNIQUE,         -- stripe session id | bitso pending_ref
  account_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,             -- created | succeeded | failed | canceled
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_provider_ref ON payments(provider_ref);

