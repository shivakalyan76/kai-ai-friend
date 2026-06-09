import os
import json
import httpx

def chat(system_prompt: str, messages: list) -> dict:
    """
    Send messages to NVIDIA API (OpenAI compatible) and parse structured JSON response.
    Returns dict with: reply, emotion, memory, is_rename, memory_moment
    """
    api_key = os.environ.get("NVIDIA_API_KEY") or os.environ.get("ANTHROPIC_API_KEY")
    api_url = os.environ.get("NVIDIA_API_URL", "https://integrate.api.nvidia.com/v1")
    model = os.environ.get("NVIDIA_MODEL", "meta/llama-3.3-70b-instruct")

    if not api_key:
        return {
            "reply": "No API key configured for the AI backend. Please set NVIDIA_API_KEY in your .env file.",
            "emotion": "confused",
            "memory": None,
            "is_rename": False,
            "memory_moment": None,
        }

    url = f"{api_url.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Format messages for OpenAI API
    nvidia_messages = [{"role": "system", "content": system_prompt}]
    for msg in messages:
        nvidia_messages.append({
            "role": msg.get("role"),
            "content": msg.get("content")
        })

    payload = {
        "model": model,
        "messages": nvidia_messages,
        "temperature": 0.7,
        "max_tokens": 300,
        "response_format": {"type": "json_object"}
    }

    try:
        response = httpx.post(url, headers=headers, json=payload, timeout=30.0)
        response.raise_for_status()
        data = response.json()
        raw = data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling NVIDIA API: {e}")
        return {
            "reply": "ngl something went wrong on my end 😅 try again?",
            "emotion": "confused",
            "memory": None,
            "is_rename": False,
            "memory_moment": None,
        }

    # Parse JSON response
    try:
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
            clean = clean.rsplit("```", 1)[0].strip()

        if not clean or clean == "{}":
            raise ValueError("Empty or missing JSON payload")

        result = json.loads(clean)
        if not isinstance(result, dict):
            raise ValueError(f"Unexpected parsed response type: {type(result).__name__}")

        reply = result.get("reply")
        if not isinstance(reply, str) or not reply.strip():
            raise ValueError(f"Missing or empty reply in parsed response: {result}")

        return {
            "reply": reply.strip(),
            "emotion": result.get("emotion", "neutral"),
            "memory": result.get("memory"),
            "is_rename": result.get("is_rename", False),
            "memory_moment": result.get("memory_moment"),
        }
    except (json.JSONDecodeError, ValueError, Exception) as e:
        print(f"Error parsing NVIDIA API response: {e}")
        print(f"Raw model response: {repr(raw)}")
        return {
            "reply": "oops, I got a little confused. can you say that again?",
            "emotion": "neutral",
            "memory": None,
            "is_rename": False,
            "memory_moment": None,
        }

