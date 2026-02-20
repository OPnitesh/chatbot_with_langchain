from app.llm.providers.google_client import get_chat_model
def generate_reply(message: str) -> str:
    llm=get_chat_model()
    result=llm.invoke(message)
    return result.content
