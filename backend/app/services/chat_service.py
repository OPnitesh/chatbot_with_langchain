"""Application service for chat interactions."""

from __future__ import annotations

import json
from threading import RLock
from typing import Any, Final, Iterator

from langchain_core.messages import AIMessage, HumanMessage

from app.llm.agent import get_chain
from app.llm.graph import graph
from app.llm.guard import BLOCK_MESSAGE, enforce_aws_only, is_aws_related

SessionState = dict[str, Any]

_SESSION_STORE: dict[str, SessionState] = {}
_SESSION_LOCK: Final[RLock] = RLock()


def _get_or_create_session(session_id: str) -> SessionState:
    with _SESSION_LOCK:
        if session_id not in _SESSION_STORE:
            _SESSION_STORE[session_id] = {"messages": []}
        return _SESSION_STORE[session_id]


def _update_session(session_id: str, state: SessionState) -> None:
    with _SESSION_LOCK:
        _SESSION_STORE[session_id] = state


def _format_sse(payload: dict[str, str]) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def stream_response(user_message: str, session_id: str) -> Iterator[str]:
    """
    Stream assistant output as Server-Sent Events (SSE) token chunks.

    Event format:
    - {"type":"token","content":"..."}
    - {"type":"end","content":"..."}
    - {"type":"error","content":"..."}
    """
    if not is_aws_related(user_message):
        yield _format_sse({"type": "token", "content": BLOCK_MESSAGE})
        yield _format_sse({"type": "end", "content": BLOCK_MESSAGE})
        return

    state = _get_or_create_session(session_id)
    prior_messages = list(state["messages"])  #history copy kara 
    prior_messages.append(HumanMessage(content=user_message)) # history + new user question.

    chunks: list[str] = []  #incoming token pieces ko collect karne ke liye.
    chain = get_chain()  # llm chain ready karta hai.

    try:
        for chunk in chain.stream({"input": user_message}):
            text = getattr(chunk, "content", "")
            if not text:
                continue

            chunks.append(text)
            yield _format_sse({"type": "token", "content": text})
    except Exception:
        yield _format_sse({"type": "error", "content": "Streaming failed."})
        raise

    final_response = "".join(chunks).strip()
    if not final_response:
        final_response = BLOCK_MESSAGE

    _update_session(
        session_id,
        {"messages": prior_messages + [AIMessage(content=final_response)]},
    )

    yield _format_sse({"type": "end", "content": final_response})


def generate_response(user_message: str, session_id: str) -> str:
    """Generate a guarded chatbot response for the given session."""
    if not is_aws_related(user_message):
        return BLOCK_MESSAGE

    state = _get_or_create_session(session_id)
    state["messages"].append(HumanMessage(content=user_message))

    result = graph.invoke(state)
    raw_response = result["messages"][-1].content
    guarded_response = enforce_aws_only(user_message, raw_response)

    if guarded_response != raw_response:
        result["messages"][-1] = AIMessage(content=guarded_response)

    _update_session(session_id, result)

    return guarded_response
