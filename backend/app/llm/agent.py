from functools import lru_cache
from pathlib import Path
from typing import Final
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


BASE_DIR: Final[Path] = Path(__file__).resolve().parent
SYSTEM_PROMPT_PATH: Final[Path] = BASE_DIR / "llm_chat.txt"


def _load_system_prompt(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"System prompt file not found: {path}")
    return path.read_text(encoding="utf-8").strip()


SYSTEM_PROMPT: Final[str] = _load_system_prompt(SYSTEM_PROMPT_PATH)


@lru_cache
def get_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        max_output_tokens=500,
    )


@lru_cache
def get_chain():
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("human", "{input}"),
        ]
    )

    return prompt | get_llm()
