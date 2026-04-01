from typing import TypedDict

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.llm.providers.google_client import get_chat_model


class UrgencyAssessment(BaseModel):
    urgency: int = Field(ge=0, le=10, description="Panic/urgency score from 0 to 10")


class PhilosopherReply(BaseModel):
    nativeText: str = Field(description="Response in Arabic script only")
    englishText: str = Field(description="Direct English translation of nativeText")


class PipelineState(TypedDict):
    message: str
    urgency: int
    nativeText: str
    englishText: str


URGENCY_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            (
                "You evaluate urgency in user messages."
                " Return ONLY a valid score from 0 to 10 where 0 means fully calm and 10 means panic/emergency."
            ),
        ),
        ("human", "Message: {message}"),
    ]
)

PHILOSOPHER_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            (
                "You are a renowned historical philosopher-scientist from Arabic culture "
                "(prefer Ibn Sina, Al-Ghazali, or Ibn Rushd depending on context).\n"
                "Rules:\n"
                "1) Native response MUST be Arabic script and right-to-left language.\n"
                "2) Keep tone aligned to urgency score.\n"
                "3) Return ONLY structured content."
            ),
        ),
        (
            "human",
            "Urgency score: {urgency}\n"
            "User message: {message}\n"
            "Provide one concise native response and its English translation.",
        ),
    ]
)


def _clamp_urgency(value: int) -> int:
    return max(0, min(10, value))


def _analyze_urgency(state: PipelineState) -> PipelineState:
    llm = get_chat_model().with_structured_output(UrgencyAssessment)
    chain = URGENCY_PROMPT | llm
    result = chain.invoke({"message": state["message"]})
    state["urgency"] = _clamp_urgency(result.urgency)
    return state


def _generate_philosopher_reply(state: PipelineState) -> PipelineState:
    llm = get_chat_model().with_structured_output(PhilosopherReply)
    chain = PHILOSOPHER_PROMPT | llm
    result = chain.invoke({"message": state["message"], "urgency": state["urgency"]})
    state["nativeText"] = result.nativeText.strip()
    state["englishText"] = result.englishText.strip()
    return state


def generate_reply(message: str) -> dict:
    """Two-step LangChain pipeline (urgency LLM → philosopher LLM). No extra graph runtime required."""
    state: PipelineState = {
        "message": message,
        "urgency": 0,
        "nativeText": "",
        "englishText": "",
    }
    state = _analyze_urgency(state)
    state = _generate_philosopher_reply(state)

    native_text = state["nativeText"]
    english_text = state["englishText"]
    return {
        "reply": f"{native_text}\n\n{english_text}",
        "urgency": state["urgency"],
        "nativeText": native_text,
        "englishText": english_text,
    }
