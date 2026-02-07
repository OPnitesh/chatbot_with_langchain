from fastapi import FastAPI
from pydantic import BaseModel
from app.services.chat_service import generate_response


import uvicorn


app=FastAPI(title="Chatbot API")


class ChatRequest(BaseModel):
    message: str
    session_id: str

# @app.get("/chat")
# def chat_info():
#     return {"info": "Use POST /chat with JSON body"}


@app.post("/chat")
def chat(req: ChatRequest):
    reply = generate_response(req.message,req.session_id)
    return {"response": reply}
    

@app.get("/health")
def health_cheack():
    return {"status":"healthy"}


if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0", port=8000)


