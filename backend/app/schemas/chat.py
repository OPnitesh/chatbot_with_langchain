from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="user input message")
    session_id: str | None = None
    email: str | None = None


class ChatResponse(BaseModel):
    reply: str
    urgency: int | None = None
    nativeText: str | None = None
    englishText: str | None = None


