from fastapi import APIRouter
from app.schemas.chat import ChatRequest,ChatResponse
from app.services.chat_service import generate_reply

router=APIRouter(prefix="/chat", tags=["chat"])

@router.post("",response_model=ChatResponse)
def chat_response(payload:ChatRequest):
     reply= generate_reply(payload.message)
     return {"reply":reply}


