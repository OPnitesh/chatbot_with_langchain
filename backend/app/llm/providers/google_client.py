from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings


def get_chat_model() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model=settings.MODEL_NAME,
        google_api_key=settings.GGOGLE_API_KEY,
        temperature=settings.TEMPERATURE,
    )
