import re
from database.db import get_conn

MEMORY_PATTERNS = [
    (r"(?:have|got|my|an?)\s+(?:maths?|science|english|history|physics|chemistry|bio|cs)\s+(?:exam|test|quiz)", "exam"),
    (r"(?:exam|test|quiz)\s+(?:next|this|tomorrow)", "exam"),
    (r"(?:interview|job)\s+(?:next|this|tomorrow|at)", "goal"),
    (r"my\s+(?:birthday|bday)\s+is", "event"),
    (r"i\s+got\s+(?:selected|accepted|hired|promoted)", "milestone"),
    (r"(?:i\s+failed|failed\s+my)", "exam"),
    (r"(?:favorite|fav)\s+(?:drink|food|movie|game|sport|song|show)", "preference"),
    (r"my\s+(?:friend|crush|gf|bf|girlfriend|boyfriend)\s+(?:is|named)", "relationship"),
    (r"my\s+(?:dog|cat|pet)\s+(?:died|passed)", "event"),
    (r"i(?:'m|\s+am)\s+(?:going\s+to|starting|joining)", "goal"),
    (r"(?:got\s+\d+\s+marks?|scored\s+\d+)", "exam"),
]


def extract_from_text(text: str, existing: list) -> dict | None:
    for pattern, category in MEMORY_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            content = text[:100]
            prefix = content.lower()[:40]
            if any(m["content"].lower()[:40] == prefix for m in existing):
                return None
            return {"content": content, "category": category, "importance": 2}
    return None


def save_memory(content: str, category: str, importance: int = 1) -> int:
    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "INSERT INTO memories (content, category, importance) VALUES (?, ?, ?)",
        (content[:120], category, importance),
    )
    conn.commit()
    mem_id = c.lastrowid
    conn.close()
    return mem_id


def get_all_memories() -> list:
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM memories ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_relevant_memories(text: str, limit: int = 5) -> list:
    """Keyword overlap scoring — no vector DB needed."""
    all_mems = get_all_memories()
    if not all_mems:
        return []

    words = set(re.findall(r"\w+", text.lower()))
    scored = []
    for m in all_mems:
        mem_words = set(re.findall(r"\w+", m["content"].lower()))
        score = len(words & mem_words)
        if score > 0:
            scored.append((score, m))

    scored.sort(key=lambda x: (-x[0], x[1]["id"]))
    return [m for _, m in scored[:limit]]


def delete_memory(mem_id: int) -> bool:
    conn = get_conn()
    conn.execute("DELETE FROM memories WHERE id = ?", (mem_id,))
    conn.commit()
    conn.close()
    return True
