from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat_service import generate_response
import traceback

router = APIRouter()

class ChatRequest(BaseModel):
    messages: list[dict]

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        reply = generate_response(req.messages)
        return {"response": reply}
    except Exception as e:
        print("🔥 CHAT ERROR:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
