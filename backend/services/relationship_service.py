from database.db import get_conn


def get_profile() -> dict:
    conn = get_conn()
    row = conn.execute("SELECT * FROM profile WHERE id = 1").fetchone()
    conn.close()
    return dict(row) if row else {}


def update_profile(patch: dict) -> dict:
    conn = get_conn()
    allowed = {"kai_name", "mode", "relationship_xp", "friendship_level"}
    sets = ", ".join(f"{k} = ?" for k in patch if k in allowed)
    vals = [v for k, v in patch.items() if k in allowed]
    if sets:
        conn.execute(
            f"UPDATE profile SET {sets}, last_seen = datetime('now') WHERE id = 1",
            vals,
        )
    else:
        conn.execute("UPDATE profile SET last_seen = datetime('now') WHERE id = 1")
    conn.commit()
    row = conn.execute("SELECT * FROM profile WHERE id = 1").fetchone()
    conn.close()
    return dict(row)


EMOTIONAL_EMOTIONS = {"sad", "excited", "fear", "angry"}


def gain_xp(emotion: str, has_memory: bool) -> dict:
    profile = get_profile()
    xp = profile.get("relationship_xp", 0) + 2
    if emotion in EMOTIONAL_EMOTIONS:
        xp += 5
    if has_memory:
        xp += 3

    level = "new"
    if xp >= 300:
        level = "best"
    elif xp >= 100:
        level = "close"

    return update_profile({"relationship_xp": xp, "friendship_level": level})
