import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "kai.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    conn = get_conn()
    c = conn.cursor()

    c.executescript(
        """
        CREATE TABLE IF NOT EXISTS profile (
            id              INTEGER PRIMARY KEY CHECK (id = 1),
            kai_name        TEXT    NOT NULL DEFAULT 'Kai',
            mode            TEXT    NOT NULL DEFAULT 'friend',
            relationship_xp INTEGER NOT NULL DEFAULT 0,
            friendship_level TEXT   NOT NULL DEFAULT 'new',
            created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
            last_seen       TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS messages (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            role        TEXT    NOT NULL,
            content     TEXT    NOT NULL,
            emotion     TEXT,
            session_id  TEXT,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS memories (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            content         TEXT    NOT NULL,
            category        TEXT    NOT NULL DEFAULT 'general',
            importance      INTEGER NOT NULL DEFAULT 1,
            created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
            last_referenced TEXT,
            reference_count INTEGER NOT NULL DEFAULT 0
        );
        """
    )

    # Seed default profile if missing
    c.execute("INSERT OR IGNORE INTO profile (id) VALUES (1)")
    conn.commit()
    conn.close()
