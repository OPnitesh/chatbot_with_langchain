"""Guards that enforce AWS-only scope for user input and model output."""

from __future__ import annotations

from functools import lru_cache
from typing import Final

from langchain_core.prompts import ChatPromptTemplate

from app.llm.agent import get_llm

BLOCK_MESSAGE: Final[str] = (
    "I specialize in AWS-related questions only. "
    "Please ask something about AWS services or architecture."
)


_CLASSIFIER_PROMPT: Final[ChatPromptTemplate] = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            (
                "You are an intent classifier for an AWS assistant.\n"
                "Classify whether the user text should be allowed.\n"
                "Return EXACTLY one token: ALLOW or BLOCK.\n\n"
                "ALLOW when:\n"
                "- It is directly about AWS, cloud architecture, DevOps, infrastructure,\n"
                "  security, networking, deployment, monitoring, scaling, or cost.\n"
                "- It is ambiguous but can reasonably be answered in AWS context.\n\n"
                "BLOCK when:\n"
                "- It is clearly unrelated to cloud/technical context.\n"
                "- It is explicitly about non-AWS ecosystems only.\n"
            ),
        ),
        ("human", "{text}"),
    ]
)


def _safe_text(message: str) -> str:
    if not isinstance(message, str):
        return ""
    return message.strip()


@lru_cache(maxsize=2048)
def _classify_aws_intent(text: str) -> bool:
    # Fast explicit allow.
    lowered = text.lower()
    if "aws" in lowered or "amazon web services" in lowered:
        return True

    try:
        chain = _CLASSIFIER_PROMPT | get_llm()
        result = chain.invoke({"text": text})
        decision = (getattr(result, "content", "") or "").strip().upper()
        return decision.startswith("ALLOW")
    except Exception:
        # Fail closed for clearly non-technical short chatter.
        if len(lowered) < 8:
            return False
        # Fail open for most technical-looking content to avoid false blocking.
        technical_hints = (
            "api",
            "server",
            "database",
            "network",
            "deploy",
            "kubernetes",
            "docker",
            "load balancer",
            "latency",
            "monitor",
            "security",
            "scaling",
            "infra",
            "cloud",
        )
        return any(hint in lowered for hint in technical_hints)


def is_aws_related(message: str) -> bool:
    """
    Return True when text should be handled by the AWS assistant.

    Uses model-based intent classification instead of hardcoded service names.
    """
    text = _safe_text(message)
    if not text:
        return False

    return _classify_aws_intent(text)


def enforce_aws_only(user_message: str, ai_response: str) -> str:
    """
    Enforce AWS-only scope.

    1. Block if user prompt is not AWS-related.
    2. Block if assistant response is not AWS-related.
    """
    if not is_aws_related(user_message):
        return BLOCK_MESSAGE

    if not is_aws_related(ai_response):
        return BLOCK_MESSAGE

    return ai_response
