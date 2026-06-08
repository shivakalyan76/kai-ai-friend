from flask import Blueprint, jsonify, request
from services.memory_service import get_all_memories, save_memory, delete_memory

memory_bp = Blueprint("memory", __name__)


@memory_bp.route("/api/memory", methods=["GET"])
def list_memories():
    return jsonify({"memories": get_all_memories()})


@memory_bp.route("/api/memory", methods=["POST"])
def create_memory():
    data = request.get_json(force=True)
    content = data.get("content", "").strip()
    category = data.get("category", "general")
    if not content:
        return jsonify({"error": "content required"}), 400
    mem_id = save_memory(content, category)
    return jsonify({"id": mem_id, "content": content, "category": category}), 201


@memory_bp.route("/api/memory/<int:mem_id>", methods=["DELETE"])
def remove_memory(mem_id):
    delete_memory(mem_id)
    return jsonify({"success": True})
