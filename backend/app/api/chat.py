"""Chat API routes."""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.services.chat_service import stream_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str = Field(min_length=1, max_length=128)


class ChatResponse(BaseModel):
    response: str


# @router.post("", response_model=ChatResponse)
# def chat(req: ChatRequest) -> ChatResponse:
#     """Return a chatbot response for the user's message within one session."""
#     reply = generate_response(req.message, req.session_id)
#     return ChatResponse(response=reply)


@router.post("/stream")
def chat_stream(req: ChatRequest) -> StreamingResponse:
    """Stream chatbot response tokens as SSE events."""
    return StreamingResponse(
        stream_response(req.message, req.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
