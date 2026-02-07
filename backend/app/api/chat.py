from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat_service import generate_response

# 1️⃣ Create router
router = APIRouter(prefix="/chat", tags=["Chat"])


# 2️⃣ Request schema (what client sends)
class ChatRequest(BaseModel):
    message: str


# 3️⃣ Response schema (what API returns)
class ChatResponse(BaseModel):
    response: str


# 4️⃣ Chat endpoint
@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Receives user message,
    calls chat service,
    returns chatbot response
    """
    reply = generate_response(req.message)
    return ChatResponse(response=reply)
