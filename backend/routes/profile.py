from flask import Blueprint, jsonify, request
from services.relationship_service import get_profile, update_profile

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/api/profile", methods=["GET"])
def get():
    return jsonify(get_profile())


@profile_bp.route("/api/profile", methods=["PATCH"])
def patch():
    data = request.get_json(force=True)
    allowed = {}
    if "kai_name" in data:
        name = str(data["kai_name"]).strip()[:20]
        if name:
            allowed["kai_name"] = name[0].upper() + name[1:]
    if "mode" in data and data["mode"] in ("friend", "bestfriend"):
        allowed["mode"] = data["mode"]
    updated = update_profile(allowed)
    return jsonify(updated)
