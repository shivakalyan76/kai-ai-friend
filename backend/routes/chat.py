from flask import Blueprint, request, jsonify
from services.claude_service import chat
from services.prompt_builder import build_system_prompt
from services.memory_service import (
    get_relevant_memories,
    get_all_memories,
    save_memory,
    extract_from_text,
)
from services.relationship_service import get_profile, gain_xp, update_profile
from database.db import get_conn

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/api/chat", methods=["POST"])
def handle_chat():
    data = request.get_json(force=True)
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "messages required"}), 400

    user_text = messages[-1].get("content", "") if messages else ""

    # Get profile + relevant memories
    profile = get_profile()
    relevant = get_relevant_memories(user_text, limit=5)
    all_mems = get_all_memories()

    system_prompt = build_system_prompt(profile, relevant)

    # Call Claude
    result = chat(system_prompt, messages[-20:])

    # Persist user message
    conn = get_conn()
    conn.execute(
        "INSERT INTO messages (role, content, emotion) VALUES (?, ?, ?)",
        ("user", user_text, result.get("emotion")),
    )

    # Persist AI message
    conn.execute(
        "INSERT INTO messages (role, content, emotion) VALUES (?, ?, ?)",
        ("assistant", result.get("reply", ""), result.get("emotion")),
    )
    conn.commit()
    conn.close()

    # Handle rename
    rename = result.get("is_rename")
    if rename and isinstance(rename, str) and 0 < len(rename) < 24:
        capitalized = rename[0].upper() + rename[1:]
        update_profile({"kai_name": capitalized})
        result["is_rename"] = capitalized

    # Handle memory from AI
    # Guard: Claude sometimes returns the string "null" instead of JSON null
    has_new_memory = False
    ai_memory = result.get("memory")
    if ai_memory == "null" or ai_memory == "false":
        ai_memory = None
    if ai_memory and isinstance(ai_memory, str):
        save_memory(ai_memory, "general", 2)
        has_new_memory = True
    else:
        # Local extraction fallback
        local_mem = extract_from_text(user_text, all_mems)
        if local_mem:
            save_memory(local_mem["content"], local_mem["category"], local_mem["importance"])
            has_new_memory = True

    # XP
    updated_profile = gain_xp(result.get("emotion", "neutral"), has_new_memory)

    return jsonify({
        **result,
        "relationship_xp": updated_profile.get("relationship_xp", 0),
        "friendship_level": updated_profile.get("friendship_level", "new"),
    })
