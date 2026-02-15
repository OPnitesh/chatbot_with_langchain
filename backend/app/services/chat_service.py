"""Application service for chat interactions."""

from __future__ import annotations

import json
import logging
import re
from typing import Iterator

from app.llm.agent import get_chain
from app.llm.guard import BLOCK_MESSAGE, enforce_aws_only, is_aws_related
from app.core.db import get_db_session
from app.core.db_models import ChatMessage

logger = logging.getLogger(__name__)

QUOTA_MESSAGE = (
    "I am temporarily rate-limited by the model provider. "
    "Please retry in a few seconds, or check API quota/billing."
)

_RETRY_SECONDS_PATTERN = re.compile(r"retry in ([0-9]+(?:\.[0-9]+)?)s", re.IGNORECASE)


def _save_message(session_id: str, role: str, content: str) -> None:
    with get_db_session() as db:
        db.add(ChatMessage(session_id=session_id, role=role, content=content))


def _format_sse(payload: dict[str, str]) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def _is_quota_error(exc: Exception) -> bool:
    text = str(exc).lower()
    return (
        "resource_exhausted" in text
        or "quota exceeded" in text
        or "rate limit" in text
        or " 429 " in f" {text} "
    )


def _quota_fallback_message(exc: Exception) -> str:
    raw = str(exc)
    match = _RETRY_SECONDS_PATTERN.search(raw)
    if not match:
        return QUOTA_MESSAGE

    retry_in = match.group(1)
    return f"{QUOTA_MESSAGE} Suggested retry: ~{retry_in}s."


def stream_response(user_message: str, session_id: str) -> Iterator[str]:
    """
    Stream assistant output as Server-Sent Events (SSE) token chunks.

    Event format:
    - {"type":"token","content":"..."}
    - {"type":"end","content":"..."}
    - {"type":"error","content":"..."}
    """
    if not is_aws_related(user_message):
        _save_message(session_id, "user", user_message)
        _save_message(session_id, "assistant", BLOCK_MESSAGE)
        yield _format_sse({"type": "token", "content": BLOCK_MESSAGE})
        yield _format_sse({"type": "end", "content": BLOCK_MESSAGE})
        return

    chunks: list[str] = []
    chain = get_chain()

    try:
        for chunk in chain.stream({"input": user_message}):
            text = getattr(chunk, "content", "")
            if not text:
                continue

            chunks.append(text)
            yield _format_sse({"type": "token", "content": text})
    except Exception as exc:
        logger.exception("LLM streaming failed")

        if _is_quota_error(exc):
            quota_msg = _quota_fallback_message(exc)
            _save_message(session_id, "user", user_message)
            _save_message(session_id, "assistant", quota_msg)
            yield _format_sse({"type": "token", "content": quota_msg})
            yield _format_sse({"type": "end", "content": quota_msg})
            return

        yield _format_sse({"type": "error", "content": "Streaming failed."})
        return

    final_response = "".join(chunks).strip()
    if not final_response:
        final_response = BLOCK_MESSAGE
    else:
        final_response = enforce_aws_only(user_message, final_response)

    _save_message(session_id, "user", user_message)
    _save_message(session_id, "assistant", final_response)

    yield _format_sse({"type": "end", "content": final_response})
