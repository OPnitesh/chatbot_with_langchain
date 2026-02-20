from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="user input message")
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str


