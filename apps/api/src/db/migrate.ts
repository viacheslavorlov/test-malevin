import { sqlite } from "./index";

export function runMigrations() {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS work_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      default_unit TEXT NOT NULL DEFAULT 'шт'
    )
  `);

  try {
    sqlite.run(`ALTER TABLE work_types ADD COLUMN default_unit TEXT NOT NULL DEFAULT 'шт'`);
  } catch {} // column already exists

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS work_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      work_type_id INTEGER NOT NULL REFERENCES work_types(id),
      volume REAL NOT NULL,
      unit TEXT NOT NULL,
      executor_name TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}
