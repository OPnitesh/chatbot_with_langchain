# agent.py

from functools import lru_cache
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
SYSTEM_PROMPT_PATH = BASE_DIR / "llm_chat.txt"

with open(SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
    system_prompt = f.read().strip()


@lru_cache
def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        max_output_tokens=500
    )


@lru_cache
def get_chain():
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}")
        ]
    )

    return prompt | get_llm()
