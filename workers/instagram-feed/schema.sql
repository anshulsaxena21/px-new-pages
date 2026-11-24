CREATE TABLE IF NOT EXISTS merchant_instagram_settings (
  merchant_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  feed_json TEXT,
  feed_cached_at INTEGER,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_merchant_instagram_updated_at
  ON merchant_instagram_settings(updated_at);
